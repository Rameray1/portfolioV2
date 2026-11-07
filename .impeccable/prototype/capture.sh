#!/bin/sh
# Captures du prototype (outil de revue, non livré). Usage : sh capture.sh
cd "$(dirname "$0")"
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
R=../review; mkdir -p $R
for t in light dark; do
  for f in index project; do sed "s/<html lang=\"fr\">/<html lang=\"fr\" data-theme=\"$t\">/" $f.html > _$f.$t.html; done
  bg=$([ $t = dark ] && echo '#161513' || echo '#ffffff')
  printf '<!doctype html><style>body{margin:0;background:%s}iframe{border:0;display:block}</style><iframe src="_index.%s.html" width="390" height="2700"></iframe>' "$bg" $t > _m.index.$t.html
  printf '<!doctype html><style>body{margin:0;background:%s}iframe{border:0;display:block}</style><iframe src="_project.%s.html" width="390" height="2700"></iframe>' "$bg" $t > _m.project.$t.html
done
shot(){ "$C" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2500 --window-size=$2 --screenshot="$R/$3" "file://$PWD/$1" >/dev/null 2>&1; }
shot _index.light.html 1440,900 desktop-fv.png
shot _index.light.html 1440,1650 desktop.png
shot _index.dark.html 1440,1650 desktop-dark.png
shot _index.light.html 1280,800 desktop-1280.png
shot _m.index.light.html 600,2700 mobile-frame.png
shot _m.index.dark.html 600,2700 mobile-dark-frame.png
shot _project.light.html 1440,1900 project-desktop.png
shot _m.project.dark.html 600,2700 project-mobile-dark-frame.png
rm -f _*.html
for f in mobile mobile-dark project-mobile-dark; do ffmpeg -loglevel error -y -i $R/$f-frame.png -vf crop=390:ih:0:0 $R/$f.png && rm $R/$f-frame.png; done
