FROM node:13-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY src ./src
COPY public ./public

CMD ["yarn", "start"]
