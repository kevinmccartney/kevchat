import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: process.env.KAFKA_BROKERS?.split(',') ?? [],
        ssl:
          process.env.KAFKA_USE_SSL === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID as string,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.KEVCHAT_API_PORT as string);
}
bootstrap();
