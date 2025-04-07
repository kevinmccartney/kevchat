import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io-client';

@WebSocketGateway()
export class ConversationsGateway {
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ): any {
    setTimeout(() => {
      client.emit('events', {
        user: {
          name: 'Kevin Costner',
          avatarUrl:
            'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRpidMUfLJZGc7i6zb3Kf_duvr9seWH1gR5qbbSnGkjEtZGEWmz',
        },
        sentAt: new Date().toISOString(),
        message: 'pong',
      });
    }, 2000);
  }
}
