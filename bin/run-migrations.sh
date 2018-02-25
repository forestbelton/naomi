#!/bin/bash

set -e

FLYWAY_URL='https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.0.7/flyway-commandline-5.0.7-linux-x64.tar.gz'

if ! ( which flyway > /dev/null ); then
    cd ${HOME}

    curl -v -O ${FLYWAY_URL}
    tar -xvzf flyway-commandline-5.0.7-linux-x64.tar.gz
    export PATH=${PATH}:${HOME}/flyway-commandline-5.0.7-linux-x64

fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}/..

flyway -configFile=./conf/flyway.conf migrate
