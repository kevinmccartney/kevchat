import { Module } from '@nestjs/common';

import { OidcConfigService } from './oidc-config.service';
import { InteractionController } from './interaction.controller';

import { UsersModule } from '../users';

@Module({
  providers: [OidcConfigService],
  exports: [OidcConfigService],
  controllers: [InteractionController],
  imports: [UsersModule],
})
export class OidcConfigModule {}
