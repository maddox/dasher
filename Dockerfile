FROM node

RUN apt-get update && \
    apt-get install -y \
    libpcap-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

VOLUME /usr/src/app/config

CMD ["npm", "start"]
