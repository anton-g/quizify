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
    console.log(this.server)
    const game = await this.playerService.connect(userId, client.id)
    console.log('Joining room', game.key)
    client.join(game.key)
    console.log('Sending update to', game.hostSocket)
    this.server.to(game.hostSocket).emit('update', game)
    console.log('Sent update')
  }

  handleDisconnect(client: Socket) {
    this.playerService.disconnect(client.id)
  }
}
