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
import { GameState } from './game.state';
import { GameSchema } from './schemas/game.schema';

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
    this.gameService.setState(keys.key, GameState.Lobby)
  }

  @SubscribeMessage('start')
  async onStart(client: Socket, key: string) {
    console.log('start game')
    this.server.to(key).emit('start')
    const game = await this.gameService.get(key)
    this.gameService.setState(game.key, GameState.Playing)
  }

  @SubscribeMessage('score')
  onScore(client: Socket, userId: string) {
    console.log('User scored', userId)
    this.playerService.score(userId, 1)
  }
}
