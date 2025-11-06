# =====================
# 1️⃣ Build phase
# =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files để tận dụng cache
COPY package*.json ./

# Cache thư mục npm để không tải lại dependency mỗi lần build
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy toàn bộ source code
COPY . .

# Build Next.js (tạo folder .next)
RUN npm run build

# =====================
# 2️⃣ Run phase
# =====================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Copy node_modules từ builder
COPY --from=builder /app/node_modules ./node_modules

# Copy build output và public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "start"]
