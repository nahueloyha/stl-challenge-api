FROM node:16

RUN mkdir -p /home/node/api && chown -R node:node /home/node/api

WORKDIR /home/node/api

COPY package*.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3006

RUN npm run build 

CMD [ "node", "dist/index.js" ]