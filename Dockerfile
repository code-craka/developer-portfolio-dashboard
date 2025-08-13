# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# --- Frontend Setup ---
# Create a directory for the public files
RUN mkdir -p public
# Copy all HTML files from the root into the container's public folder
COPY *.html ./public/

# --- Backend Setup ---
# Copy backend's package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend/ ./

# Make port 7860 available to the world outside this container
EXPOSE 7860

# Define the command to run your app
CMD ["npm", "start"]