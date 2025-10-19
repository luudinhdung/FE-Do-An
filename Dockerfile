# =====================
# 1. Build phase
# =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files để tận dụng cache
COPY package*.json ./

# Cài dependency đầy đủ
RUN npm ci

# Copy toàn bộ source
COPY . .

# Build Next.js (tạo folder .next)
RUN npm run build

# =====================
# 2. Run phase
# =====================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Copy node_modules từ builder sang
COPY --from=builder /app/node_modules ./node_modules

# Copy build output và public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Expose cổng
EXPOSE 3000

# Start app
CMD ["npm", "start"]
