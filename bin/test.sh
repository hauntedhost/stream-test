#!/usr/bin/env bash
# make a test http/2 post request with data.json

curl \
  --http2 \
  --insecure \
  --request POST \
  --header "Content-Type: application/json" \
  --data-binary @data.json \
  https://localhost:5050/post
