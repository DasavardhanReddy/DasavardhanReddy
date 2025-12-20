FROM node:18-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

EXPOSE 5000

ENV PORT=5000
CMD ["node", "server.js"]
