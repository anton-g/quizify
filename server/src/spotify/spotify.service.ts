import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { User } from "../user/interfaces/user.interface";
import * as querystring from 'querystring';
import { UserService } from "../user/services/user.service";

@Injectable()
export class SpotifyService {
  private readonly apiUrl: string = 'https://api.spotify.com/v1';

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService
  ) {
    httpService.axiosRef.interceptors.response.use(null, this.handleExpiredAccessToken.bind(this))
  }

  get authorizeUrl(): string {
    const data = {
      scope: this.config.spotifyScope,
      client_id: this.config.spotifyClientId,
      redirect_uri: this.config.spotifyRedirectUri,
      response_type: 'code',
      state: 'state' // TODO: randomize state, verify
    }
    return `https://accounts.spotify.com/authorize?${querystring.stringify(data)}`
  }

  async login(authorizationCode: string): Promise<any> {
    const result = await this.httpService.request({
      url: `https://accounts.spotify.com/api/token`,
      method: 'POST',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        redirect_uri: this.config.spotifyRedirectUri,
        code: authorizationCode,
        client_id: this.config.spotifyClientId,
        client_secret: this.config.spotifyClientSecret
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).toPromise()

    return result.data
  }

  async me(accessToken: string): Promise<any> {
    const { data } = await this.httpService.get(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).toPromise()

    return data
  }

  async getUserDevices(user: User): Promise<any> {
    var tempToken = 'BQDCSiJ0lYQhiePANioGj3G94yz3aNIeNNJDnqvoVj3dehSiWvEv1woHIP5wMZGLYYSIyPfSB2-BgJk1FCM9QJhE7d-Bbh0KBXeGN48UYo4IzEGtOWuHus9fi93jrLe3_PhE2nsP29LG6LLzqwtR-KiH7u47i7SFswBsMQ'
    const result = await this.httpService.get(`${this.apiUrl}/me/player/devices`, {
      headers: {
        Authorization: `Bearer ${tempToken}`
      }
    }).toPromise()

    return result.data.devices
  }

  async getUserPlaylists(user: User, offset: number = 0): Promise<any> {
    const { data } = await this.httpService.get(`${this.apiUrl}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${user.spotifyAccessToken}`
      },
      params: {
        limit: 50,
        offset: offset
      }
    }).toPromise()

    return data.items
  }

  async getUserPlaylist(user: User, playlistId: string): Promise<any> {
    const { data: playlist } = await this.httpService.get(`${this.apiUrl}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${user.spotifyAccessToken}`
      }
    }).toPromise()
    let nextTrackUrl = playlist.tracks.next
    while (nextTrackUrl) {
      const { data } = await this.httpService.get(nextTrackUrl, {
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`
        }
      }).toPromise()
      playlist.tracks.items = [...playlist.tracks.items, ...data.items]
      nextTrackUrl = data.next
    }

    return playlist
  }

  async playTrack(user: User, trackId: string, deviceId: string) {
    try {
      await this.httpService.request({
        url: `${this.apiUrl}/me/player/play`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`
        },
        data: {
          uris: [trackId]
        },
        params: {
          device_id: deviceId
        }
      }).toPromise()
    }
    catch (err) {
      console.log(err)
    }
  }

  async pausePlayback(user: User) {
    try {
      await this.httpService.request({
        url: `${this.apiUrl}/me/player/pause`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`
        }
      }).toPromise()
    }
    catch (err) {
      console.log(err)
    }
  }

  async resumePlayback(user: User) {
    try {
      await this.httpService.request({
        url: `${this.apiUrl}/me/player/play`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`
        }
      }).toPromise()
    }
    catch (err) {
      console.log(err)
    }
  }

  async handleExpiredAccessToken(reqError) {
    if (reqError.config && reqError.response && reqError.response.status === 401) {
      const authHeader = reqError.config.headers.Authorization.split(' ')
      if (authHeader.length < 2) return Promise.reject(reqError)
      const accessToken = authHeader[1]

      const user = await this.userService.getByAccessToken(accessToken)
      if (!user) return Promise.reject(reqError)

      const data = await this.loginWithRefreshToken(user)
      console.log(data)
      await this.userService.updateAccessToken(user.id, data.access_token)

      const conf = reqError.config
      conf.headers.Authorization = `Bearer ${data.access_token}`
      return this.httpService.request(conf).toPromise()
    }

    return Promise.reject(reqError)
  }

  async loginWithRefreshToken(user: User) {
    const { data } = await this.httpService.request({
      url: `https://accounts.spotify.com/api/token`,
      method: 'POST',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: user.spotifyRefreshToken
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.spotifyClientId}:${this.config.spotifyClientSecret}`).toString('base64')}`
      }
    }).toPromise()

    return data
  }
}
