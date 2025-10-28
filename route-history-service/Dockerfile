# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN rm -rf node_modules && npm install

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the app
CMD [ "npm", "start" ]