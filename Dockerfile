# Stage 1: Build the Vite production bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install packages
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build Vite application
RUN npm run build

# Stage 2: Serve using lightweight, hardened Nginx
FROM nginx:1.27-alpine AS runner

# Remove default configuration and apply custom SPA config
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
