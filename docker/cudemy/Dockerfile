# Backend Dockerfile
FROM node:18.17.1-slim as base
LABEL maintainer="hello@beerjoa.dev"
LABEL build_date="2023-10-26"

RUN apt-get update; \
    apt-get install --no-install-recommends --no-install-suggests -q -y \
        procps \
        curl \
        ; \
    apt-get autoremove -y; \
    apt-get clean; \
    rm -rf \
        /var/cache/apt/archives \
        /var/cache/ldconfig/* \
        /var/lib/apt/lists/* \
        /var/log/alternatives.log \
        /var/log/apt/* \
        /var/log/dpkg.log

RUN mkdir -p /data/app && \
    chown -R node:node /data/app

WORKDIR /data/app

COPY package.json package-lock.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000
CMD ["npm", "run", "start:debug:docker"]

# Production
FROM base as production

COPY .env.production ./.env

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
