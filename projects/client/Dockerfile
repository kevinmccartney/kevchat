# From https://github.com/vercel/next.js/blob/a5e0aabfb850ec2e872b01b946521836aea9521d/examples/with-docker/Dockerfile

FROM node:18-alpine AS base

ARG KEVCHAT_API_URL
ARG KEVCHAT_CLIENT_URL
ARG KEVCHAT_FRONT_DOOR_URL

ENV NEXT_PUBLIC_KEVCHAT_API_URL=${KEVCHAT_API_URL}
ENV NEXT_PUBLIC_KEVCHAT_CLIENT_URL=${KEVCHAT_CLIENT_URL}
ENV NEXT_PUBLIC_KEVCHAT_FRONT_DOOR_URL=${KEVCHAT_FRONT_DOOR_URL}

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY projects/client/package.json package-lock.json ./
COPY projects/client/patches ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./projects/client package-lock.json* ./

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/src/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]