#!/usr/bin/env bash

echo -e 'Creating kafka topic'
kafka-topics --bootstrap-server ${KAFKA_HOST}:${KAFKA_INTERNAL_LISTENER_PORT} --create --if-not-exists --topic=${KEVCHAT_IDP_USER_UPSERT_TOPIC_NAME} --replication-factor=1 --partitions=1

echo -e 'Successfully created the following topics:'
kafka-topics --bootstrap-server ${KAFKA_HOST}:${KAFKA_INTERNAL_LISTENER_PORT} --list
