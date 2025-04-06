FROM mongodb/mongodb-community-server:8.0.6-ubuntu2204

USER root

RUN apt-get update && \
    apt-get install -y netcat

USER mongodb
