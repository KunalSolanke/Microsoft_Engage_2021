FROM node:12.13.0-alpine

# for caching optimisations
COPY package*.json /
RUN yarn add
# required to serve the react app on the live server
RUN yarn add -g serve

WORKDIR /app
COPY . /app
# noop files for non python projects and local development
RUN echo "#!/bin/bash" > /app/migrate.sh && chmod +x /app/migrate.sh
RUN echo "#!/bin/bash" > /usr/local/bin/start && chmod +x /usr/local/bin/start

ENV PATH=/node_modules/.bin:$PATH
ENV PORT=3000
ENV HOST=0.0.0.0
ENV BROWSER='none'
EXPOSE 3000

RUN yarn run build

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]