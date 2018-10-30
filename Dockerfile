FROM node:8.12.0-alpine

RUN apk add yarn

COPY . /opt/circle-build-health
WORKDIR /opt/circle-build-health
RUN yarn install --production && \
    yarn build


EXPOSE 3000
CMD yarn start:prod
