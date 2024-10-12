FROM node:21.2.0-alpine

WORKDIR /Server

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# env is passed at runtime, e.g. docker run --env-file .env ...
ENV PORT=8181

EXPOSE 8181

CMD [ "npm" , "run" , "start" ]
