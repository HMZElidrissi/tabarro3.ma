FROM node:20-alpine AS base

# Enable corepack to use pnpm
RUN corepack enable

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Only copy files needed to install dependencies
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install dependencies using the lockfile (no dev deps needed in final image)
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app

# Bring installed node_modules and the rest of the source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js (standalone output)
ENV NODE_ENV=production
RUN pnpm build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone server and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port and run the server
EXPOSE 3000
CMD ["node", "server.js"]