FROM node:9.2.0

WORKDIR /opt/naomi

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD [ "npm", "start" ]
