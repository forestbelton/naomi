# naomi [![Build Status](https://travis-ci.org/forestbelton/naomi.svg?branch=master)](https://travis-ci.org/forestbelton/naomi)

friendly chat bot

### Windows/macOS/Linux

You need Flyway installed: https://flywaydb.org/

```bash
git clone https://github.com/forestbelton/naomi.git
yarn install
APP_TOKEN=bot_token ./bin/start-naomi.sh
```

### Docker

```bash
docker build -t forestbelton/naomi:0.1.0 .
docker run --env APP_TOKEN=bot_token -it forestbelton/naomi:0.1.0
```
