# =====================
# 1️⃣ Build phase
# =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build Next.js
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
