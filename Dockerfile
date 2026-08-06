FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY config ./config

EXPOSE 8000

CMD ["npm", "run", "start:http"]
