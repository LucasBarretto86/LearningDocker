FROM node:18-alpine

WORKDIR dummy-api/

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 5500

CMD ["node", "app.js", "--port 5500"]