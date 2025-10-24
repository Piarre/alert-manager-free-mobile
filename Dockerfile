FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun build --outfile=index.js --minify --target=bun --production src/index.ts

# Si tu n'as pas besoin de node_modules en production après le build
FROM oven/bun:1-alpine AS release
WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY --from=build /usr/src/app/index.js .
COPY --from=build /usr/src/app/package.json .

USER bun
EXPOSE ${PORT:-2025}/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-2025}/debug/healthcheck || exit 1

ENTRYPOINT [ "bun", "run", "index.js" ]