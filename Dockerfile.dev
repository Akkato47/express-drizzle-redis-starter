FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 8000

CMD ["yarn", "dev"]