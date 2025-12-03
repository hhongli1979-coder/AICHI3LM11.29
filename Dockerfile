# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using --legacy-peer-deps as noted in README)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
# Use npm run build if available, otherwise fall back to npx vite build
RUN if grep -q '"build"' package.json; then npm run build; else npx vite build; fi

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
