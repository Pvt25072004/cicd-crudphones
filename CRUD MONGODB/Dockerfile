FROM node:18-alpine

# build Docker Image
WORKDIR /app

# copy source and install dependency
COPY package*.json ./
RUN npm install

COPY . .

# expose port be
EXPOSE 8080

# command server be
CMD ["node", "app.js"]