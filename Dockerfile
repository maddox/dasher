FROM node:7
MAINTAINER	Sneaker15 <github@outgoer.de>

#Install libpcap-dev
RUN \
    apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y libpcap-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

CMD npm run start
