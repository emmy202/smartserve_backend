import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@MessageBody() role: string, @ConnectedSocket() client: Socket) {
    if (role === 'KITCHEN_STAFF') {
      client.join('kitchen_queue');
      return { event: 'joined', data: 'kitchen_queue' };
    } else if (role === 'BAR_STAFF') {
      client.join('bar_queue');
      return { event: 'joined', data: 'bar_queue' };
    }
    return { event: 'error', data: 'Invalid role' };
  }

  // Called by OrdersController or OrdersService after an update
  notifyQueueUpdate(queueType: 'kitchen' | 'bar', payload: any) {
    this.server.to(`${queueType}_queue`).emit('queueUpdate', payload);
  }
}
