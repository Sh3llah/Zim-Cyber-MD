FROM node:lts-buster

WORKDIR /app

RUN git clone https://github.com/Sh3llah/Zim-Cyber-MD.git .

RUN npm install && npm install -g pm2

EXPOSE 9090


CMD ["pm2-runtime", "index.js"]
