FROM node:14

# Creates a directory for the API
WORKDIR /usr/src/greetings

# Copies the package files and the greetings.js into the WORKDIR
COPY package*.json ./
COPY greetings.js .

RUN npm install 

# tells docker that this image will be listening on port 3000
EXPOSE 3000

ENV LANG EN
CMD [ "node", "greetings.js"]