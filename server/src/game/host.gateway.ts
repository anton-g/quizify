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
import { GameService } from './game.service';

@WebSocketGateway()
export class HostGateway {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  @SubscribeMessage('host')
  onHost(client: Socket, keys: any) {
    console.log('set host', client.id)
    this.gameService.setHost(keys.key, keys.secret, client.id)
  }

  @SubscribeMessage('score')
  onScore(client: Socket, userId: string) {
    this.playerService.score(userId, 1)
  }
}
