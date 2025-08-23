FROM node:lts-slim

WORKDIR /app

COPY apps/server/package*.json ./

RUN npm install --legacy-peer-deps

COPY apps/server/src ./src
COPY apps/server/eslint.config.mjs ./
COPY apps/server/tsconfig*.json ./
COPY .env ./

RUN npm run build 

EXPOSE 5000

CMD ["npm", "run", "start"]