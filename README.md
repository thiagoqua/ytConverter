# App Overview
Welcome to our **YouTube-to-Audio converter**, a web application built using Angular and Express. This platform provides an intuitive solution for users aiming to extract high-quality audio from their favorite YouTube videos. With a simple design, our application ensures fast conversions and is optimized for use across various devices. We prioritize both audio quality and user data security, ensuring efficient processing without storing any user data post-conversion.
<br/>

# Supported Formats for Download
The hosted version of this application supports downloading YouTube videos in the **MP3** format only. This limitation is due to the underlying library, `ytdl-core`, which provides MP3 as its primary audio format for download.

# Docker Container for WAV Downloads
For users interested in downloading in **WAV** format, i have developed a Docker container. This container leverages the power of **FFmpeg**, a renowned multimedia framework, to process and convert the audio streams.

## About FFmpeg
FFmpeg is a comprehensive multimedia processing tool that can read audio and video in various formats, process them, and produce output in desired formats. It's widely used for tasks such as converting and streaming audio and video.

### Note on Using FFmpeg
While the Docker container provides an environment for downloading in WAV format using FFmpeg, it's crucial to note that if you're attempting to run the application outside of this container, **FFmpeg must be installed and accessible in your system's PATH**. The application depends on FFmpeg for WAV conversions, and without it, this functionality will not work.


# Running the backend locally with Docker
1. Go to the backend dir and build the container: `docker build . -t backend:test`.
2. Run the container: `docker run -p 8080:8080 --name backend -d backend:test`

# Running the frontend locally with Node
1. Go to the frontend dir and install the node dependencies: `npm install`
2. Run the app: `ng serve`