FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY app.ts tsconfig.json ./

RUN npm run build && npm prune --omit=dev

RUN mkdir -p /data

EXPOSE 4001

CMD ["node", "dist/app.js"]
