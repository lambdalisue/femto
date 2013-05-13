#!/usr/bin/env bash
cake release
cat publish/header www/js/femto.js > publish/femto.js
cat publish/header www/css/app.css > publish/femto.css
cake debug
