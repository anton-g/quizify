import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { GameEvents, GameState } from '../game.state';
import { Player } from '../interfaces/player.interface';
import { GameDto } from '../dtos/game.dto';
import { extractRequest } from '../../common/GatewayHelpers';
import { PlayerDto } from '../dtos/player.dto';

@WebSocketGateway()
export class HostGateway {
  @WebSocketServer() server: Server;

  constructor (
    private readonly playerService: PlayerService,
    private readonly gameService: GameService
  ) {}

  @SubscribeMessage(GameEvents.Host)
  async onHost(client: Socket, req) {
    let { data: keys, ack } = extractRequest(req)

    await this.gameService.setHost(keys.key, keys.secret, client.id)
    const game = await this.gameService.setState(keys.key, GameState.Lobby)

    ack(new GameDto(game))

    console.log(`[${keys.key}] Set host socket to '${client.id}' using secret '${keys.secret}'`)
  }

  @SubscribeMessage(GameEvents.Start)
  async onStart(client: Socket, req) {
    let { data: key, ack } = extractRequest(req)

    let game = await this.gameService.get(key)
    game = await this.gameService.setState(game.key, GameState.Playing)
    this.server.to(key).emit(GameEvents.Start)

    ack(new GameDto(game))

    console.log(`[${key}] Start game`)
  }

  @SubscribeMessage(GameEvents.Resume)
  async onResume(client: Socket, req) {
    let { data: key, ack } = extractRequest(req)

    this.server.to(key).emit(GameEvents.Resume)
    const game = await this.gameService.setState(key, GameState.Playing)

    ack(new GameDto(game))

    console.log(`[${key}] Resume game`)
  }

  @SubscribeMessage(GameEvents.Score)
  async onScore(client: Socket, req) {
    let { data: userId, ack } = extractRequest(req)

    const score: number = 1
    const player: Player = await this.playerService.score(userId, score)
    this.server.to(player.socketId).emit(GameEvents.Scored, score)

    ack(new PlayerDto(player))

    console.log(`[?] Player ${player.name} (${userId}) scored ${score}`)
  }
}
