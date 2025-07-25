FROM node:22-alpine

WORKDIR /app

COPY apps/server/package*.json ./

RUN npm install

COPY apps/server/src ./src
COPY apps/server/eslint.config.mjs ./
COPY apps/server/tsconfig*.json ./
COPY .env ./

RUN npm run build 

EXPOSE 5000

CMD ["npm", "run", "start"]