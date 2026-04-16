FROM node:20-alpine AS base

# --- Dependencies (production only for final image) ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- Builder (needs all deps including devDependencies for build) ---
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (server mode, not static export)
ENV NEXT_TELEMETRY_DISABLED=1
ENV DEPLOY_TARGET=azure
# SQLite for build + runtime (ephemeral per container)
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma db push --skip-generate
RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema + migrations for runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Copy pre-initialized SQLite database (nextjs needs write access for WAL/journal)
COPY --from=builder --chown=nextjs:nodejs /app/prisma/dev.db ./prisma/dev.db

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:./prisma/dev.db"

CMD ["node", "server.js"]
