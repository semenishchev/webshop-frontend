FROM alpine:latest
RUN adduser --disabled-password --home /home/container container
USER container
ENV USER=container HOME=/home/container
WORKDIR /home/container
COPY build/app .
CMD ["./app"]