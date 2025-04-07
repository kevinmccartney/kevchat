import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: process.env.KAFKA_BROKERS?.split(',') ?? [],
          },
          consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP_ID as string,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
