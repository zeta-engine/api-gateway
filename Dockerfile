FROM node:12.13.0-alpine
RUN mkdir -p /opt/api-gateway
WORKDIR /opt/api-gateway
RUN adduser -S api-gateway
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start:dev" ]