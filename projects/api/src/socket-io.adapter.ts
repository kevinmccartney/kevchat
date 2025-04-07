import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';
import { instrument } from '@socket.io/admin-ui';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
    });

    server.on('connection', (socket: any) => {
      this.logger.log(`Client connected: ${socket.id}`);

      // Set any custom event listeners or Socket.IO middleware here
      socket.on('disconnect', () => {
        this.logger.log(`Client disconnected: ${socket.id}`);
      });
    });

    instrument(server, {
      auth: false,
      mode:
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      namespaceName: '/admin',
    });

    return server;
  }
}
