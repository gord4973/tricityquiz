#!/bin/bash
# supervisor: restarts the app if it dies
cd "$(dirname "$0")"
while true; do node server.js >> data/app.log 2>&1; sleep 2; done
