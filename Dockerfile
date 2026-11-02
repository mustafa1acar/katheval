# ==========================================
# Katheval Platform - Production Multi-Stage Dockerfile
# Optimized for Coolify Deployment
# ==========================================

# Stage 1: Build React (Vite) Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy client package definitions
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm ci

# Copy client source files
COPY client/ ./client/

# Build client production bundle
RUN cd client && npm run build

# Stage 2: Production Node.js Server
FROM node:20-alpine AS runner

WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy root package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy server codebase, database schema and static assets
COPY server/ ./server/
COPY schema.sql ./
COPY logo.jpeg ./

# Copy built frontend assets from builder stage
COPY --from=builder /app/client/dist ./client/dist

# Expose backend port
EXPOSE 5000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

# Start Katheval Express Server
CMD ["node", "server/index.js"]
