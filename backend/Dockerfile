FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY .. .

# Build if needed (adjust if you have different build command)
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
