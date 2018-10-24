import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { User } from "../user/interfaces/user.interface";
import * as SpotifyWebApi from 'spotify-web-api-node'
import * as fetch from 'node-fetch'

@Injectable()
export class SpotifyService {
  private readonly spotify: any;

  constructor(
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

  async getUserPlaylists(user: User, offset: number = 0): Promise<any> {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    const { statusCode, body } = await this.spotify.getUserPlaylists(user.id, {
      limit: 50,
      offset: offset
    })
    this.spotify.resetAccessToken()

    return body.items
  }

  async getUserPlaylist(user: User, playlistId: string): Promise<any> {
    this.spotify.setAccessToken(user.spotifyAccessToken)
    const { statusCode, body: playlist } = await this.spotify.getPlaylist(playlistId)
    let nextTrackUrl = playlist.tracks.next
    while (nextTrackUrl) {
      const newBodyRaw = await fetch(nextTrackUrl, {
          headers: {
            Authorization: `Bearer ${user.spotifyAccessToken}`
          }
        })
      const newBody = await newBodyRaw.json()
      playlist.tracks.items = [...playlist.tracks.items, ...newBody.items]
      nextTrackUrl = newBody.next
    }
    this.spotify.resetAccessToken()

    return playlist
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
    }
    this.spotify.resetAccessToken()
  }
}
