#!/usr/bin/env bash
# 為 AI 片段疊加右上角 Zebra Logo 和右下角字幕（後期加，避免生成模型畫錯 Logo 和文字）
# 用法：scripts/overlay-brand.sh 輸入.mp4 輸出.mp4 "用 Zebra TC22 收貨" [字型檔]
set -euo pipefail
in="$1"; out="$2"; caption="$3"
font="${4:-$(fc-match -f '%{file}' 'Noto Sans TC:bold')}"
logo="$(dirname "$0")/../assets/brand/logo.png"
h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in")
logo_h=$((h * 7 / 100)); margin=$((h * 4 / 100)); fs=$((h * 45 / 1000))
# Logo 原檔為黑色，倉庫背景偏灰，改為白色並加陰影
ffmpeg -loglevel error -y -i "$in" -i "$logo" -filter_complex "\
[1:v]scale=-1:${logo_h},lutrgb=r=255:g=255:b=255,split[l][s];\
[s]lutrgb=r=0:g=0:b=0,colorchannelmixer=aa=0.45,boxblur=3[sh];\
[0:v][sh]overlay=W-w-${margin}+2:${margin}+2[v0];[v0][l]overlay=W-w-${margin}:${margin}[v1];\
[v1]drawtext=fontfile='${font}':text='${caption}':fontsize=${fs}:fontcolor=white:\
box=1:boxcolor=black@0.55:boxborderw=$((fs / 2)):x=w-tw-${margin}-$((fs / 2)):y=h-th-${margin}-$((fs / 2))[v]" \
  -map "[v]" -map 0:a? -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy "$out"
echo "✓ $out"
