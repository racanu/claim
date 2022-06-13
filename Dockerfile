FROM alpine:3 AS system-base
USER root

ARG UID=1000
ARG GID=1000
ARG USER=racanu
ARG GROUP=racanu
ARG WORKDIR=/home/racanu/sb/claim

ENV TZ=Europe/Amsterdam
ENV PS1="[\\w]🐳 "

WORKDIR ${WORKDIR}
RUN apk update && apk add vim git npm python3 python3-dev php nodejs
RUN npm install express

#This is needed in order to share the git archive
#RUN addgroup -g ${GID} ${GROUP}
##RUN mkdir /home/${USER}
##RUN chown ${UID}:${GID} /home/${USER}
#RUN echo ${USER}:x:${UID}:${GID}:${USER}:/home/${USER}:/bin/ash >> /etc/passwd
#RUN adduser ${USER} root
#USER ${UID}:${GID}

