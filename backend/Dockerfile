FROM node:20-alpine3.17
RUN apk update && apk add ffmpeg
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 1414
CMD ["npm","start"]