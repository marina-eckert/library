FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY public ./public
COPY uploads ./uploads

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["npm", "start"]