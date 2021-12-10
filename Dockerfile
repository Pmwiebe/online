FROM node:latest

WORKDIR /app

EXPOSE 8080

RUN npm init -y
RUN npm install express body-parser mysql nodemon

# CMD ["npx", "nodemon", "src/server.js"]