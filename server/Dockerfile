FROM node:16-alpine

WORKDIR /usr/app/server

COPY ./package.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
