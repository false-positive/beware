FROM node:18-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /app
RUN pnpm add --global turbo
COPY . .
RUN turbo prune @acme/nextjs --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

ARG NEXT_PUBLIC_MACHINE_URL
ENV NEXT_PUBLIC_MACHINE_URL=$NEXT_PUBLIC_MACHINE_URL

ARG DOCKER_PORT
ENV DOCKER_PORT=$DOCKER_PORT

ARG DOCKER_HOST
ENV DOCKER_HOST=$DOCKER_HOST

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

ARG EMAIL_SERVER
ENV EMAIL_SERVER=$EMAIL_SERVER

ARG EMAIL_FROM
ENV EMAIL_FROM=$EMAIL_FROM

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ENV DISCORD_CLIENT_ID=
ENV DISCORD_CLIENT_SECRET=

RUN pnpx turbo run build --filter=@acme/nextjs...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/nextjs/next.config.mjs .
COPY --from=installer /app/apps/nextjs/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/static ./apps/nextjs/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/public ./apps/nextjs/public

CMD node apps/nextjs/server.js
