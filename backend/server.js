const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
// Load .env from the backend directory explicitly so the server works when started
// from other working directories (e.g., project root or a container)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fs = require('fs');
const logPath = path.join(__dirname, 'server.log');
// Simple persistent logger: write console output to file as well to capture events that occur before a terminal is copied
const appendLog = (level, ...args) => {
  const msg = `[${new Date().toISOString()}] ${level.toUpperCase()}: ${args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')}\n`;
  try { fs.appendFileSync(logPath, msg); } catch (e) { /* ignore file write errors */ }
};
const _log = console.log.bind(console);
const _err = console.error.bind(console);
console.log = (...a) => { appendLog('info', ...a); _log(...a); };
console.error = (...a) => { appendLog('error', ...a); _err(...a); };
console.warn = (...a) => { appendLog('warn', ...a); _log(...a); };

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
// Default host: prefer IPv4 0.0.0.0 in development so 127.0.0.1 and external IPv4 addresses work easily
// You can still override with the HOST env var (eg HOST=127.0.0.1)
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? undefined : '0.0.0.0');

// Expose PID and basic startup info to help debugging shutdowns
console.log(`Starting backend process. PID=${process.pid}, NODE_ENV=${process.env.NODE_ENV || 'development'}, HOST=${HOST}, PORT=${PORT}`);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Validate MONGO_URI early with clear message
if (!process.env.MONGO_URI) {
  console.error('\nERROR: MONGO_URI is not defined.\nPlease set MONGO_URI in backend/.env (e.g. MONGO_URI=mongodb://127.0.0.1:27017/DVR_PROJECT)\n');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");

  // Simple request logger
  app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
    next();
  });

  // Mount routes
  app.use('/api/drivers', require('./routes/drivers'));
  app.use('/api/vehicles', require('./routes/vehicles'));
  app.use('/api/messages', require('./routes/messages'));
  app.get('/', (_req, res) => res.send('Server is running!'));
  
  //app.use('/vehicles', vehicleRoutes);
  //app.use('/api', vehicleRoutes);



  let server = app.listen(PORT,  () => {
    console.log(`Server running and listening on ${PORT}`);
  });

  // Graceful shutdown helper
  const gracefulShutdown = (signal) => {
    console.log(`Received ${signal} - Shutting down server...`);
    if (server && server.close) {
      server.close(() => {
        console.log('HTTP server closed');
        mongoose.disconnect().then(() => {
          console.log('MongoDB disconnected, exiting');
          process.exit(0);
        }).catch(e => {
          console.error('Error disconnecting MongoDB:', e);
          process.exit(1);
        });
      });
    } else {
      console.log('No server to close, exiting');
      process.exit(0);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('message', m => console.log('process message:', m));
  process.on('exit', code => console.log('Process exit event with code', code));
  process.on('uncaughtException', err => { console.error('Uncaught exception', err); process.exit(1); });
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Catch uncaught errors
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
