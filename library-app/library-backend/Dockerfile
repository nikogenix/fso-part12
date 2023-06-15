FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci 

ENV MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database
ENV DEBUG=library-backend:*

USER node

CMD ["npm", "start"]