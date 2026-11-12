#!/usr/bin/env bash
# Arma los tres MP4 y los pósters a partir de frames/<idioma>/fNNNNN.jpg y
# los deja en public/. Uso: ./encode.sh [fps]
set -euo pipefail
cd "$(dirname "$0")"
FPS=${1:-25}
for L in es en pt; do
  ffmpeg -y -loglevel error -framerate "$FPS" -i "frames/$L/f%05d.jpg" \
    -c:v libx264 -preset veryfast -crf 29 -pix_fmt yuv420p -movflags +faststart \
    -an "../../public/video/central-tour-$L.mp4"
  # Póster: el cuadro de la central completa, con su título (t = 5 s).
  ffmpeg -y -loglevel error -i "frames/$L/f$(printf '%05d' $((FPS * 5))).jpg" \
    -c:v libwebp -quality 82 "../../public/img/central-tour-$L.webp"
done
ls -la ../../public/video/central-tour-*.mp4 ../../public/img/central-tour-*.webp
