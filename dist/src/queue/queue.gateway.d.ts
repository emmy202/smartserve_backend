import { Server, Socket } from 'socket.io';
export declare class QueueGateway {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinQueue(role: string, client: Socket): {
        event: string;
        data: string;
    };
    notifyQueueUpdate(queueType: 'kitchen' | 'bar', payload: any): void;
}
