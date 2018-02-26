#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/.."

echo "Applying migrations..."
/root/flyway-5.0.7/flyway -configFile=./conf/flyway.conf migrate

echo "Starting bot..."
npm start
