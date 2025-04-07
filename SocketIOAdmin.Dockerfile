FROM node:22 as base

ARG KEVCHAT_SOCKET_IO_ADMIN_PORT

ENV KEVCHAT_SOCKET_IO_ADMIN_PORT=${KEVCHAT_SOCKET_IO_ADMIN_PORT}

WORKDIR /app

RUN git clone https://github.com/socketio/socket.io-admin-ui.git .
RUN git checkout 0.5.1

RUN npm install --global serve

WORKDIR ui/dist

CMD serve -p ${KEVCHAT_SOCKET_IO_ADMIN_PORT}