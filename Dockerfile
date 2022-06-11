FROM alpine:3 AS system-base
USER root
ENV TZ=Europe/Amsterdam
ENV PS1="[\\w]🐳 "
RUN apk update && apk add git npm python3 python3-dev php nodejs
