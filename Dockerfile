# =====================
# 1️⃣ Build phase
# =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Build arguments từ Jenkinsfile
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENCRYPTION_KEY

# Thiết lập biến môi trường cho Next.js build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENCRYPTION_KEY=$NEXT_PUBLIC_ENCRYPTION_KEY

# Copy package files
COPY package*.json ./

# Cài dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build Next.js (sẽ dùng ENV phía trên)
RUN npm run build

# =====================
# 2️⃣ Run phase
# =====================
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000
CMD ["npm", "start"]
