FROM node:12.13.0-alpine
WORKDIR /code

RUN mkdir -p /code/node_modules
COPY package.json .

#Setup
RUN yarn install
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
ADD ./entrypoint /entrypoint
RUN chmod +x /wait
RUN chmod +x /entrypoint

EXPOSE 3000
ENV NODE_ENV=development

COPY . .