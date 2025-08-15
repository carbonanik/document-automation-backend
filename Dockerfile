# 1️⃣ Builder stage
FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# 2️⃣ Production stage
FROM node:22 AS runner

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Optional: copy Prisma schema if you need migrations at runtime
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
