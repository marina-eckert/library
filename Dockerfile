FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY uploads ./uploads
COPY tsconfig.json ./tsconfig.json

RUN npm run build && npm prune --omit=dev

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["node", "dist/app.js"]
