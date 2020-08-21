#builder
FROM arm32v7/node:14.8-alpine as builder
WORKDIR /usr/bot/
COPY . .
RUN npm install
RUN npm install typescript -g
RUN npm run build


#prod
FROM arm32v7/node:14.8-alpine
WORKDIR /usr/bot/
COPY package*.json ./
COPY config/ .config/
COPY --from=builder /usr/bot/dist ./dist
RUN npm isntall --production
RUN npm install pm2 -g
CMD ["pm2-runtime","dist/app.js"]