# Base image
FROM node:22

# Create app directory
WORKDIR /app

COPY projects/api/package.json package-lock.json ./

# Install app dependencies
RUN npm i

# Bundle app source
COPY ./projects/api .

# Copy the .env and .env.development files
# COPY .env .env.development ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]