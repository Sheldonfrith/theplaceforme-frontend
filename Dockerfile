FROM node:15.4.0
WORKDIR /docker
COPY front-end/package.json /docker/front-end/package.json
RUN cd front-end && npm install
COPY . /docker
