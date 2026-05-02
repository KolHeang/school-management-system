FROM node:18-alpine

# Install dependencies needed for some node packages
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
