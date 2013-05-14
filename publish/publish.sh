#!/usr/bin/env bash
cake release
cat publish/header www/js/femto.js > publish/femto.js
cat publish/header www/css/app.css > publish/femto.css
cake debug
tar zcvf publish/femto.tar.gz publish/femto.js publish/femto.css README.md
zip publish/femto.zip publish/femto.js publish/femto.css README.md
