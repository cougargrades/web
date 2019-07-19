#!/bin/sh 
SESSNAME=$(basename "$PWD")"-"$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 4 | head -n 1)
tmux new-session -s $SESSNAME -d
tmux send-keys "clear; npm --prefix ./app start" Enter
tmux split-window -h
tmux send-keys "clear; npm --prefix ./functions run watch" Enter
tmux split-window -v
tmux send-keys "clear; firebase serve --host 0.0.0.0" Enter
tmux -2 attach-session -d 