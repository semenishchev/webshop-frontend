#/bin/sh
bun --bun run build && \
bun build --compile --target=bun-linux-x64 .\build\index.js --outfile build/app && \
docker build . -t therealolek/webshop-frontend:1