FROM node:13-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY api ./api

EXPOSE 5000

CMD [ "yarn", "run", "debug" ]