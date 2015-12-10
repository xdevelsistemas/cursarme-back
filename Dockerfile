FROM node:0.12.7-wheezy

MAINTAINER Clayton Santos da Silva "clayton@xdevel.com.br"

# add project to build
ADD . /root/book4you
WORKDIR /root/book4you
RUN npm install -g  mongoose@4.1.7 &&\
    npm install -g  satan-pm &&\
    npm install -g  grunt-cli &&\
    npm install &&\
    npm install --dev &&\
    grunt default


EXPOSE 3000
CMD ["npm","start"]
