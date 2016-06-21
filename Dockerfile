FROM toppano/laputa-base:latest

MAINTAINER uniray7 uniray7@gmail.com

# install nodejs
ENV NODE_VERSION 5.11.1
ENV NVM_DIR /home/.nvm

RUN . $NVM_DIR/nvm.sh && nvm install v$NODE_VERSION && nvm alias default v$NODE_VERSION
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

#install pm2
RUN npm install -g pm2

# setup project
ADD . /home/verpix/verpix-web-app
RUN chown -R verpix:verpix /home/verpix/verpix-web-app

USER verpix
WORKDIR /home/verpix/verpix-web-app
RUN npm install

EXPOSE 3000

ENV API_ROOT="http://verpix-dev-laputa-api:3000"
ENV STATIC_URL="http://verpix-dev-laputa-api:8001"
CMD npm run dev
