FROM node:21.2.0-alpine

WORKDIR /app

COPY package.json /app/
RUN npm install --force

COPY public/ /app/public/
COPY src/ /app/src/

# env is passed at runtime, e.g. docker run --env-file .env ...
ENV PORT=3000

EXPOSE 3000

CMD [ "npm" , "run" , "start" ]
