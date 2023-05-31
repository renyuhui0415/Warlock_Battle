#! /bin/bash

JS_PATH=/home/work_starhui/Warlock_Battle/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_PATH_DIST}game.js

cd ../
echo yes | python3 manage.py collectstatic
