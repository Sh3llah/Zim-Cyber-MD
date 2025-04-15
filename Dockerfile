WORKDIR /app

Install necessary dependencies
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

Copy package files and install dependencies
COPY package*.json ./
RUN npm install

Install qrcode-terminal globally
RUN npm install -g qrcode-terminal

Copy the entire project
COPY 

Expose the port your app uses
EXPOSE 5000

Start the bot
CMD ["node", "index.js"]
