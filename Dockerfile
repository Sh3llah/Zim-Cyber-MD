
RUN git clone https://github.com/Sh3llah/Zim-Cyber-MD.git

Set working directory to your bot folder inside the cloned repo
WORKDIR /Zim-Cyber-MD/ikmalvin

Install dependencies
RUN npm install && npm install -g pm2

Expose the port your bot uses
EXPOSE 9090

Run your bot
CMD ["npm", "start"]
