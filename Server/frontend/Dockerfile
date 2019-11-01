FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY ./frontend .

RUN npm install -g

CMD ng serve --host 0.0.0.0 --port 4200
