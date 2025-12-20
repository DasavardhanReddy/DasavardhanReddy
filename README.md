# DVR_PROJECT — Local development & Docker

This repository contains a small vehicle/driver tracking demo with a Node/Express + MongoDB backend and a React frontend.

Two ways to run locally:

1) Quick local (requires MongoDB installed locally)

- Install dependencies:
  - Backend: `cd backend && npm install`
  - Frontend: `cd frontend && npm install`
- Ensure MongoDB is running locally (default URI: `mongodb://127.0.0.1:27017/DVR_PROJECT`). You can change this in `backend/.env`.
- Seed the DB (optional): `cd backend && npm run seed`
- Start backend: `cd backend && npm run dev` (uses nodemon) or `npm start`
- Start frontend: `cd frontend && npm start`
- Open the app in your browser: http://localhost:3000

2) Docker Compose (recommended for an isolated, full-stack run)

- Requirements: Docker and Docker Compose installed
- From repository root run: `docker compose up --build`
- The frontend will be served at http://localhost:3000 (or 80 depending on your compose ports), the backend at http://localhost:5000

Notes & troubleshooting
- If the frontend shows a network error, confirm the backend is running at port 5000 and `backend/.env` MONGO_URI is correct.
- The frontend respects `REACT_APP_API_URL` at build time. When using Docker Compose the nginx layer proxies `/api` to the backend automatically.

If you'd like, I can:
- Add a `make` script or npm script to `start` both services locally.
- Add CI steps to build and test the app.
- Provide a single-step Windows PowerShell start script.

