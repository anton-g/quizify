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

  async getUserDevices(user: User): Promise<any> {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    const result = await this.spotify.getMyDevices()
    this.spotify.resetAccessToken()

    return result.body.devices
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

  async playTrack(user: User, trackId: string, deviceId: string) {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    try {
      await this.spotify.play({
        uris: [trackId],
        device_id: deviceId
      })
    } catch (err) {
      console.log(err)
      console.log(user)
      console.log(trackId)
    }
    this.spotify.resetAccessToken()
  }

  async pausePlayback(user: User): Promise<boolean> {
    let result = true
    this.spotify.setAccessToken(user.spotifyAccessToken)
    try {
      await this.spotify.pause()
    } catch (err) {
      result = false
    }
    this.spotify.resetAccessToken()
    return result
  }

  async resumePlayback(user: User) {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    try {
      await this.spotify.play()
    } catch (err) {
      console.log(err)
      console.log(user)
    }
    this.spotify.resetAccessToken()
  }
}
