#!/usr/bin/env bash
# Copia en src/ lo que el recorrido carga y no se versiona: three.js y sus
# addons (de la versión del sitio, en node_modules de la raíz), las fuentes
# del sitio y el logo. Correr una vez antes de render.cjs.
set -euo pipefail
cd "$(dirname "$0")"
ROOT=../..
cp "$ROOT/node_modules/three/build/three.module.js" "$ROOT/node_modules/three/build/three.core.js" src/
rm -rf src/addons && cp -r "$ROOT/node_modules/three/examples/jsm" src/addons
mkdir -p src/fonts
cp "$ROOT"/node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2 src/fonts/
cp "$ROOT"/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 src/fonts/
cp "$ROOT"/node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2 src/fonts/
cp "$ROOT/public/img/logo-mark.png" src/
echo "listo"
