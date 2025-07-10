FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g turbo

COPY package*.json ./

COPY apps/client/package*.json ./apps/client/
COPY apps/server/package*.json ./apps/server/

RUN npm ci

COPY . .

RUN npm run build && \
    echo "Build completed, checking output..." && \
    ls -la apps/server/ && \
    test -d apps/server/dist && \
    echo "Build verification successful"

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/server/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/.env ./.env

EXPOSE 4000

CMD ["npm", "run", "start"]