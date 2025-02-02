ARG APPNAME="${APPNAME}" \
  PORT="${PORT}" \
  NODE_ENV="prod" \
  LOCALE="true" \
  PRODUCTION_URL="${PRODUCTION_URL}" \
  CLIENT_BASE_URL="${CLIENT_BASE_URL}" \
  DATABASE_HOST="${DATABASE_HOST}" \
  DATABASE_PORT="${DATABASE_PORT}" \
  DATABASE_USER="${DATABASE_USER}" \
  DATABASE_PASSWORD="${DATABASE_PASSWORD}" \
  DATABASE_NAME="${DATABASE_NAME}" \
  DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}" \
  JWT_ACCESS_SECRET="${JWT_ACCESS_SECRET}" \
  JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}" \
  REDIS_HOST="${REDIS_HOST}" \
  REDIS_PORT="${REDIS_PORT}" \
  REDIS_PASSWORD="${REDIS_PASSWORD}" \
  BUCKET_KEY="${BUCKET_KEY}" \
  BUCKET_SECRET="${BUCKET_SECRET}" \
  BUCKET_ENDPOINT="${BUCKET_ENDPOINT}" \
  BUCKET_NAME="${BUCKET_NAME}" \
  MAIL_HOST="${MAIL_HOST}" \
  MAIL_USER="${MAIL_USER}" \
  MAIL_PASSWORD="${MAIL_PASSWORD}" \
  MAIL_FROM="${MAIL_FROM}" \
  MAIL_PORT="${MAIL_PORT}" 


FROM node:20.11-alpine AS builder

WORKDIR /var/www

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM builder

WORKDIR /var/www

COPY --from=builder /var/www/dist ./dist
COPY --from=builder /var/www/src/db/drizzle/migrations ./dist/db/drizzle/migrations
COPY --from=builder /var/www/src/db/drizzle/migrations/meta ./dist/db/drizzle/migrations/meta
COPY --from=builder /var/www/package-lock.json .
COPY --from=builder /var/www/scripts/install-prod.sh ./scripts

COPY package.json ./

RUN sh ./scripts/install-prod.sh

ENV APPNAME="${APPNAME}" \
  PORT="${PORT}" \
  NODE_ENV="${NODE_ENV}" \
  LOCALE="${LOCALE}" \
  PRODUCTION_URL="${PRODUCTION_URL}" \
  CLIENT_BASE_URL="${CLIENT_BASE_URL}" \
  DATABASE_HOST="${DATABASE_HOST}" \
  DATABASE_PORT="${DATABASE_PORT}" \
  DATABASE_USER="${DATABASE_USER}" \
  DATABASE_PASSWORD="${DATABASE_PASSWORD}" \
  DATABASE_NAME="${DATABASE_NAME}" \
  DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}" \
  JWT_ACCESS_SECRET="${JWT_ACCESS_SECRET}" \
  JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}" \
  REDIS_HOST="${REDIS_HOST}" \
  REDIS_PORT="${REDIS_PORT}" \
  REDIS_PASSWORD="${REDIS_PASSWORD}" \
  BUCKET_KEY="${BUCKET_KEY}" \
  BUCKET_SECRET="${BUCKET_SECRET}" \
  BUCKET_ENDPOINT="${BUCKET_ENDPOINT}" \
  BUCKET_NAME="${BUCKET_NAME}" \
  MAIL_HOST="${MAIL_HOST}" \
  MAIL_USER="${MAIL_USER}" \
  MAIL_PASSWORD="${MAIL_PASSWORD}" \
  MAIL_FROM="${MAIL_FROM}" \
  MAIL_PORT="${MAIL_PORT}" 

EXPOSE ${PORT}
