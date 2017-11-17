FROM node:9.2.0

# Install system dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -yyq install \
    default-jre sqlite3 libav-tools curl

# Set up flyway for migratinos
WORKDIR /opt

RUN curl https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.2.0/flyway-commandline-4.2.0-linux-x64.tar.gz \
    | tar xvz
ENV PATH $PATH:/opt/flyway-4.2.0

# Install application dependencies
WORKDIR /opt/naomi

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD ["./bin/start-naomi.sh"]
