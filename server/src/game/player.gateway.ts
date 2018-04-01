import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { PlayerService } from './player.service';

@WebSocketGateway()
export class PlayerGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor (private readonly playerService: PlayerService) {}

  @SubscribeMessage('join')
  async onJoin(client: Socket, userId: string) {
    const game = await this.playerService.connect(userId, client.id)
    client.join(game.key)
    console.log('joined room', game.key)
    this.server.to(game.hostSocket).emit('update', game)
  }

  handleDisconnect(client: Socket) {
    this.playerService.disconnect(client.id)
  }
}
