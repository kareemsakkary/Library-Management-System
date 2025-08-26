# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# This allows us to install dependencies before copying the rest of the app
# which can speed up builds if package.json doesn't change often
COPY package*.json ./

# Install app dependencies
# npm ci is preferred over npm install in Docker for reproducible builds
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "start" ]
