FROM node:16-alpine as builder

WORKDIR /usr/app/client

COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run test --coverage --watchAll=false
RUN npm run build

FROM nginx
COPY --from=builder /usr/app/client/build /usr/share/nginx/html
