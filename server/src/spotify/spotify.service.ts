import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { User } from "../user/interfaces/user.interface";
import * as SpotifyWebApi from 'spotify-web-api-node'
import { access } from "fs";

@Injectable()
export class SpotifyService {
  private readonly spotify: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService) {
      this.spotify = new SpotifyWebApi({
        clientId: config.spotifyClientId,
        clientSecret: config.spotifyClientSecret,
        redirectUri: config.spotifyRedirectUri
      })
    }

  get authorizeUrl(): string {
    const state = 'state' // TODO: randomize state, verify
    const scopes = this.config.spotifyScope.split(' ')
    return this.spotify.createAuthorizeURL(scopes, state)
  }

  async login(authorizationCode: string): Promise<any> {
    const result = await this.spotify.authorizationCodeGrant(authorizationCode)
    return result.body
  }

  async me(accessToken: string): Promise<any> {
    this.spotify.setAccessToken(accessToken)
    const result = await this.spotify.getMe()
    this.spotify.resetAccessToken()

    return result.body
  }

  async getUserPlaylists(user: User): Promise<any> {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    const { statusCode, body } = await this.spotify.getUserPlaylists(user.id)
    this.spotify.resetAccessToken()

    return body.items
  }

  async getUserPlaylist(user: User, playlistId: string): Promise<any> {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    const { statusCode, body } = await this.spotify.getPlaylist(user.id, playlistId)
    this.spotify.resetAccessToken()

    return body
  }

  async playTrack(user: User, trackId: string) {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    await this.spotify.play({
      uris: [trackId]
    })
    this.spotify.resetAccessToken()
  }

  async pausePlayback(user: User) {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    await this.spotify.pause()
    this.spotify.resetAccessToken()
  }

  async resumePlayback(user: User) {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    const r = await this.spotify.play()
    console.log(r)
    this.spotify.resetAccessToken()
  }
}
