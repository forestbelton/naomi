#!/bin/bash

set -e

FILE_PATH=$1
FILE_URL=$2

youtube-dl --output ${FILE_PATH} --audio-format opus --audio-quality 9 -x \
    ${FILE_URL}
