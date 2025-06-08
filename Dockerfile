FROM oven/bun:alpine AS builder

WORKDIR /app

COPY . .
RUN bun install --no-save && bun run build

FROM oven/bun:alpine

RUN apk add --no-cache libstdc++ ca-certificates && \
    adduser -D -h /home/container container

USER container
ENV USER=container HOME=/home/container
WORKDIR /home/container

COPY --from=builder /app/build ./

EXPOSE 3000

CMD ["bun", "index.js"]