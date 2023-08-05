FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
