#!/usr/bin/env bash
# generate local certs for dev https connection

bindir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
datadir="${bindir}/../data"

openssl req \
  -x509 \
  -newkey rsa:4096 \
  -nodes \
  -keyout "${datadir}/privkey.pem" \
  -out "${datadir}/cert.pem" \
  -days 365 \
  -subj "/CN=localhost"
