FROM node:9.2.0

WORKDIR /opt/naomi

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -yyq install \
    default-jre sqlite3 libav-tools

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD ["./bin/start-naomi.sh"]
