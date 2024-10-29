FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 5500

CMD ["yarn", "run", "dev"]