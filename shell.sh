#!/bin/bash
SHELL_IMAGE=claim:1

shopt -s nocasematch && [[ "$1" = "rebuild" ]] && echo Removing image $SHELL_IMAGE
shopt -s nocasematch && [[ "$1" = "rebuild" ]] && docker image rm $SHELL_IMAGE

docker image inspect $SHELL_IMAGE &> /dev/null
[[ $? -ne 0 ]] && docker build --target system-base -t $SHELL_IMAGE -f Dockerfile .

VOLUMES="-v $HOME:$HOME -v /mnt:/mnt"
ENV="-e PATH=$PATH"

grep -q docker /proc/1/cgroup
[[ $? -eq 0 ]] && VOLUMES="--volumes-from `hostname`"

docker run -it --rm $VOLUMES --env PATH --workdir `pwd` $SHELL_IMAGE /bin/sh
