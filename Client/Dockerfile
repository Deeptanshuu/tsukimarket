FROM node:21.2.0

WORKDIR V:\Deeptanshu Lal\INTERN\E-com + MongoDB

COPY package*.json ./

RUN npm install --force

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["npm","run","start"]
