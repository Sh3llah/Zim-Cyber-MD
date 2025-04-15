
FROM node:lts-buster

Set the working directory inside the container
WORKDIR /app

Clone the repository into the container
RUN git clone https://github.com/Sh3llah/Zim-Cyber-MD.git .

Install dependencies
RUN npm install

Expose the port your application will run on
EXPOSE 9090

Command to run your application
CMD ["npm", "start"]
