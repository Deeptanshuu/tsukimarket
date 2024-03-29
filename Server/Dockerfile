FROM node:21.2.0

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

ENV PORT=8181

EXPOSE 8181

CMD ["npm", "start"]
