FROM node:21.2.0-alpine

WORKDIR /app

COPY public/ /app/public/
COPY src/ /app/src/
COPY .env /app/
COPY package.json /app/

RUN npm install --force

ENV PORT=3000

EXPOSE 3000

CMD [ "npm" , "run" , "start" ]


