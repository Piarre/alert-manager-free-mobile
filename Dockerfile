FROM oven/bun AS build

ENV PORT=2025
ENV useOtel=false
WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

RUN bun build \
	--compile \
	--minify${useOtel:+-whitespace} \
	--minify${useOtel:+-syntax} \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE ${PORT:-2025}