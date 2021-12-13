FROM node:16.13.1-alpine

RUN apk update && \
  apk add mysql-client openssl

RUN mkdir /apollo-server-template
WORKDIR /apollo-server-template
ADD . /apollo-server-template
