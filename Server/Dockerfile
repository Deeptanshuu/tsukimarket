FROM node:21.2.0-alpine

WORKDIR /Server

COPY . .

RUN npm install

ENV PORT=8181

EXPOSE 8181

CMD [ "npm" , "run" , "start" ]
