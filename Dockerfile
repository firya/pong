FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ .

# Copy public folder
COPY public/ ./public/

# Build if needed
RUN npm run build

# Expose port
EXPOSE 3001

# Set production environment
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
