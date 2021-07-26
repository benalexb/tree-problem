FROM node:16-alpine

WORKDIR /usr/app

COPY ./package.json ./
RUN npm install

COPY ./src ./src
COPY ./db ./db
COPY ./babel.config.cjs ./

CMD [ "npm", "run", "dev" ]
