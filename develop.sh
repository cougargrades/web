#!/bin/sh 
SESSNAME=$(basename "$PWD")"-"$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 4 | head -n 1)
tmux new-session -s $SESSNAME -d
#tmux split-window -h
tmux send-keys "cd app; yarn start" Enter
tmux split-window -v
tmux send-keys "firebase serve --host 0.0.0.0" Enter
tmux -2 attach-session -d 