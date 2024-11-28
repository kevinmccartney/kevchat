# Base image
FROM node:22

ARG KEVCHAT_CLIENT_URL

ENV NEXT_PUBLIC_KEVCHAT_CLIENT_URL=${KEVCHAT_CLIENT_URL}

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY projects/front-door/package.json package-lock.json* ./

# Install app dependencies
RUN npm i

# Bundle app source
COPY ./projects/front-door .

# Expose the port on which the app will run
EXPOSE 8080

# Expose debug port
EXPOSE 9231

ENV NODE_OPTIONS = "--inspect=127.0.0.1:9231"

# Start the server using the debug build
CMD ["npm", "run", "dev"]