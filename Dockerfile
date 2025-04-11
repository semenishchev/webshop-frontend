FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json vite.config.ts tsconfig.json svelte.config.js src static ./
RUN bun install --no-save

COPY . .
RUN bun --bun run build
RUN bun build --compile --target=bun-linux-x64 build/index.js --outfile /app/app

FROM alpine:latest

RUN adduser --disabled-password --home /home/container container

USER container
ENV USER=container HOME=/home/container
WORKDIR /home/container

COPY --from=builder /app/app .

CMD ["./app"]