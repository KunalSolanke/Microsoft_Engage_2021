FROM node:12.13.0-alpine

WORKDIR /app
# for caching optimisations
COPY package.json /
RUN yarn install
# required to serve the react app on the live server
RUN yarn global add serve

COPY . .
EXPOSE 3000
RUN yarn run build
EXPOSE 80