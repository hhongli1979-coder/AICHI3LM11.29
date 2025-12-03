# OmniCore Wallet - ogegge Docker Image
# Centralized Docker image management for all environments

# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production Stage (Nginx)
# ============================================
FROM nginx:alpine AS production

# Set labels for image identification
LABEL maintainer="OmniCore Team"
LABEL description="ogegge - OmniCore Wallet Production Image"
LABEL version="1.0.0"
LABEL environment="production"

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================
# Stage 3: Development Stage
# ============================================
FROM node:22-alpine AS development

LABEL maintainer="OmniCore Team"
LABEL description="ogegge - OmniCore Wallet Development Image"
LABEL version="1.0.0"
LABEL environment="development"

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
