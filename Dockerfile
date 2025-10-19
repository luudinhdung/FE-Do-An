# =====================
# 1. Build phase
# =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files trước để tận dụng cache layer
COPY package*.json ./

# Cài dependencies (đầy đủ để build)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build Next.js (tạo folder .next)
RUN npm run build

# =====================
# 2. Run phase
# =====================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy file cần thiết
COPY package*.json ./

# Cài dependencies production (giữ lại peer dependencies để tránh lỗi framer-motion)
RUN npm ci --omit=dev || npm install --omit=dev

# Copy build output từ builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Copy các file config bổ sung nếu cần (ví dụ .env.production)
# COPY --from=builder /app/.env.production ./

# Mở cổng và chạy
EXPOSE 3000
CMD ["npm", "start"]
