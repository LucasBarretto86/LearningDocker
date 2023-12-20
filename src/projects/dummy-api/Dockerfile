FROM node:18-alpine

WORKDIR dummy-api/

COPY . .

RUN yarn install

EXPOSE 5500

CMD ["node", "app.js", "--port 5500"]