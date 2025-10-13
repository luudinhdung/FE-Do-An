# =====================
# 1. Build phase
# =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files trước để tận dụng cache layer
COPY package*.json ./

# Cài dependencies (đầy đủ để build)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build Next.js (tạo folder .next)
RUN npm run build

# =====================
# 2. Run phase
# =====================
FROM node:18-alpine AS runner
WORKDIR /app

# Copy file cần thiết
COPY package*.json ./

# Cài dependencies cho production
RUN npm install --omit=dev

# Copy build output từ builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.env ./

# Mở cổng và chạy
EXPOSE 3000
CMD ["npm", "start"]
