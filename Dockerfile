#builder
FROM node:14.8 as builder
WORKDIR /usr/src/
COPY . .
RUN npm install
RUN npm install typescript -g
RUN npm run build


#prod
FROM node:14.8
WORKDIR /usr/src/
COPY package*.json ./
COPY /assets /usr/src/assets
COPY --from=builder /usr/src/dist ./dist
RUN npm install --production
