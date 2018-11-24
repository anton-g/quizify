import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { User } from "../user/interfaces/user.interface";
import * as querystring from 'querystring';
import { UserService } from "../user/services/user.service";

@Injectable()
export class HueService {
  private readonly apiUrl: string = 'https://api.spotify.com/v1';

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService
  ) { }

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
    // TODO this should be replaced with Digest authentication https://www.developers.meethue.com/documentation/remote-api-authentication
    const { data: authData } = await this.httpService.request({
      url: `https://api.meethue.com/oauth2/token?code=${authorizationCode}&grant_type=authorization_code`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.config.hueClientId}:${this.config.hueClientSecret}`).toString('base64')}`
      }
    }).toPromise()

    const { data: configData } = await this.httpService.request({
      url: `https://api.meethue.com/bridge/0/config`,
      method: 'PUT',
      data: {
        'linkbutton': true
      },
      headers: {
        'Authorization': `Bearer ${authData.access_token}`
      }
    }).toPromise()

    const { data: bridgeData } = await this.httpService.request({
      url: ` https://api.meethue.com/bridge`,
      method: 'POST',
      data: {
        'devicetype': 'quizify'
      },
      headers: {
        'Authorization': `Bearer ${authData.access_token}`
      }
    }).toPromise()

    return {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      username: bridgeData[0].success.username
    }
  }

  async getLights(accessToken: string, username: string): Promise<any> {
    const { data: lights } = await this.httpService.request({
      url: `https://api.meethue.com/bridge/${username}/lights`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).toPromise()

    return lights
  }

  async blink(user: User): Promise<any> {
    const result = await this.httpService.request({
      url: `https://api.meethue.com/bridge/${user.hueUsername}/lights/2/state`,
      method: 'PUT',
      data: {
        'alert': 'select'
      },
      headers: {
        'Authorization': `Bearer ${user.hueAccessToken}`
      }
    }).toPromise()

    return result
  }

  // async me(accessToken: string): Promise<any> {
  //   const { data } = await this.httpService.get(`${this.apiUrl}/me`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   }).toPromise()

  //   return data
  // }
}
