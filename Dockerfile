FROM node:lts-slim
WORKDIR /app


COPY package*.json ./

COPY src ./src

RUN npm install


EXPOSE ${COORDINATOR_A_PORT}

CMD ["npm", "start"]