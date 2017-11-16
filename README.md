# naomi

friendly chat bot

### Windows/macOS/Linux

```bash
git clone https://github.com/forestbelton/naomi.git
yarn install
APP_TOKEN=bot_token npm start
```

### Docker

```bash
docker build -t forestbelton/naomi:0.1.0 .
docker run --env APP_TOKEN=bot_token -it forestbelton/naomi:0.1.0
```
