dockerfile
FROM node:lts-buster

Set working directory inside container
WORKDIR /app

Clone your GitHub repo into the working directory
RUN git clone https://github.com/Sh3llah/Zim-Cyber-MD.git .

Install dependencies
RUN npm install && npm install -g pm2

Expose the port your app uses
EXPOSE 9090

Start your app
CMD ["npm", "start"]




🔁 What to Do

1. *Open your Dockerfile*
2. *Remove any lines that start with `//`*
3. *Paste the clean version above*

Let me know if you're running it on Render, and I can walk you through the full setup. 👌
