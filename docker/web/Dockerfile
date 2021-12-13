FROM node:16.13.1-alpine

RUN apk update && \
  apk add mysql-client

RUN mkdir /apollo-server-template
WORKDIR /apollo-server-template
ADD . /apollo-server-template
