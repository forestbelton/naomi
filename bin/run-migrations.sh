#!/bin/bash

set -e

case $(uname -s) in
Darwin)
    FLYWAY_URL='https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.0.7/flyway-commandline-5.0.7-macosx-x64.tar.gz'
    ;;
*)
    FLYWAY_URL='https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.0.7/flyway-commandline-5.0.7-linux-x64.tar.gz'
    ;;
esac

if ! ( which flyway > /dev/null ); then
    pushd $(mktemp -d)

    curl -s ${FLYWAY_URL} | tar -xz
    PATH=${PATH}:$(pwd)/flyway-5.0.7

    popd
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}/..

flyway -configFile=./conf/flyway.conf migrate
