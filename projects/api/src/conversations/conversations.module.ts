import { Module } from '@nestjs/common';
import { ConversationsGateway } from 'src/conversations/conversation.gateway';

@Module({
  providers: [ConversationsGateway],
})
export class ConversationsModule {}
