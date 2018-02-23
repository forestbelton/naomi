# naomi [![Build Status](https://travis-ci.org/forestbelton/naomi.svg?branch=master)](https://travis-ci.org/forestbelton/naomi)

friendly chat bot

## Setup instructions

Install the required software:

* [Node.js](https://nodejs.org/en/)
* [Flyway](https://flywaydb.org/)
* [ffmpeg](https://www.ffmpeg.org/)
* [gnuplot](http://gnuplot.info/) (**NOTE**: Must be built with `libcairo` support)

Perform the following steps from the command-line:

```bash
$ git clone https://github.com/forestbelton/naomi.git
$ yarn install
```

Create a new bot user and retrieve its application token according to [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).

**NOTE:** If you already have an application token, you can skip this.

Set the application token in the environment and run the start script:

```bash
$ export APP_TOKEN=<YOUR_TOKEN_HERE>
$ ./bin/start-naomi.sh
```

**NOTE:** Make sure you replace `<YOUR_TOKEN_HERE>` with the application token you created.

## Setup with Docker

There is a [Dockerfile](./Dockerfile) for this project, so building/running the application
is also possible via [Docker](https://www.docker.com/). In order to build the image and start
a container running the application, perform the following:

```bash
$ docker build -t forestbelton/naomi:0.1.0 .
$ docker run --env APP_TOKEN=<YOUR_TOKEN_HERE> -it forestbelton/naomi:0.1.0
```
