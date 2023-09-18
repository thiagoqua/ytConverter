FROM node:20-alpine3.17
RUN apk update && apk add ffmpeg
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm","start"]