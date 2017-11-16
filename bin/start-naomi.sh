#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/.."

echo "Applying migrations..."
find migrations -type f -name '*.sql' -exec \
    sh -c "sqlite3 naomi.db < {}" \;

echo "Starting bot..."
npm start