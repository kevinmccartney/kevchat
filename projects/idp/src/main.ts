import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded } from 'body-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '../', 'public'));
  app.setBaseViewsDir(join(__dirname, '../', 'views'));
  app.setViewEngine('ejs');

  app.use('/interaction', urlencoded({ extended: false }));

  app.use(
    session({
      secret: process.env.KEVCHAT_IDP_SESSION_COOKIE_KEY as string,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true }, // Set to `true` if using HTTPS
    }),
  );

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('KevChat IDP')
    .setDescription('The identity provider for KevChat')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

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
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.KEVCHAT_IDP_PORT);
}
bootstrap();
