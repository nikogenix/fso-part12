FROM node:16

WORKDIR /usr/src/app

COPY . .

COPY --chown=node:node . .
RUN npm install

ENV DEBUG=todo-backend:*
ENV REDIS_URL=redis://localhost:6379
ENV MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database

USER node
CMD npm run dev
