FROM provectuslabs/kafka-ui:latest as base

USER root

RUN apk add curl

USER kafkaui

ENV SERVER_PORT=8081
