FROM arm32v7/node:14.8-alpine
WORKDIR /usr/bot/
COPY package.json ./
COPY config/ .config/
RUN npm install
RUN npm install pm2 -g
RUN npm install typescript -g
RUN npm run build
COPY ./dist .
CMD ["pm2-runtime","app.js"]