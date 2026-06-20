FROM python:3.12-alpine

# ffmpeg: audio transcoding used by yt-dlp
# nodejs: required by yt-dlp's JS runtime to solve YouTube's n-challenge
RUN apk add --no-cache ffmpeg nodejs npm ca-certificates

# Install yt-dlp with optional deps (includes the EJS n-challenge solver assets)
RUN pip install --no-cache-dir -U "yt-dlp[default]"

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]