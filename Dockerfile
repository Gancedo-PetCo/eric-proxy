FROM node:12.6-alpine
WORKDIR /nick-proxy-server
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
CMD ["node", "index.js"]