#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}/..

DATABASE=naomi.db
TABLE=jukebox_songs

sqlite3 -column -cmd "SELECT path,url FROM ${TABLE}" ${DATABASE} < /dev/null \
    | parallel ./bin/fill-song-task.sh 
