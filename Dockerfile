FROM   arm32v7/ubuntu:latest
MAINTAINER	Maik Schwan <maik.schwan@gmail.com>

#Install libpcap-dev
RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get install -y nodejs && \
    apt-get install -y npm && \
    apt-get install -y git && \
    apt-get install -y wget && \
    apt-get install -y libpcap-dev

#update node
RUN wget http://node-arm.herokuapp.com/node_latest_armhf.deb
RUN dpkg -i node_latest_armhf.deb

#install dasher
RUN cd /root && export GIT_SSL_NO_VERIFY=1 && \
    git config --global http.sslVerify false && \
    git clone https://github.com/maddox/dasher.git

WORKDIR /root/dasher
RUN cd /root/dasher && npm install

# Interface the environment
VOLUME /root/dasher/config

# Baseimage init process
CMD cd /root/dasher && npm run start
