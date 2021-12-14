FROM node:16.13.1

RUN apt-get update -qq && \
  apt-get install -y default-mysql-client

RUN mkdir /apollo-server-template
WORKDIR /apollo-server-template
ADD . /apollo-server-template
