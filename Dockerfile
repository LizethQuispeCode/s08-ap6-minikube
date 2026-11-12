FROM node:18-alpine

WORKDIR /app

COPY src/package.json .
RUN npm install --production

COPY src/server.js .

EXPOSE 3000

CMD ["npm", "start"]