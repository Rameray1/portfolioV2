#!/bin/sh
# Installe Tectonic (Linux x86_64) pour la CI et Vercel : `npm run build` compile le CV PDF avec.
# Le binaire va dans node_modules/.bin, que npm met dans le PATH des scripts. En local : brew.
set -eu

VERSION=0.17.0
SHA256=8533d07f9ccbd7a65824b9e0459041bca34af1eb33daba48f59215593753a3b7
ARCHIVE="tectonic-$VERSION-x86_64-unknown-linux-musl.tar.gz"
URL="https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40$VERSION/$ARCHIVE"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

curl -fsSL --retry 3 -o "$tmp/$ARCHIVE" "$URL"
echo "$SHA256  $tmp/$ARCHIVE" | sha256sum -c -
mkdir -p node_modules/.bin
tar -xzf "$tmp/$ARCHIVE" -C node_modules/.bin tectonic
node_modules/.bin/tectonic --version
