import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { User } from "../user/interfaces/user.interface";

@Injectable()
export class SpotifyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService) {}

  get authorizeUrl(): string {
    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.config.spotifyClientId}&scope=${this.config.spotifyScope}&redirect_uri=${this.config.spotifyRedirectUri}`
  }

  async login(authorizationCode: string): Promise<any> {
    const data = `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${this.config.spotifyRedirectUri}&client_id=${this.config.spotifyClientId}&client_secret=${this.config.spotifyClientSecret}`
    const result = await this.httpService.post('https://accounts.spotify.com/api/token', data).toPromise()

    console.log(result.data)

    return result.data
  }

  async me(accessToken: string): Promise<any> {
    const result = await this.httpService.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }).toPromise()

    return result.data
  }

  async getUserPlaylists(user: User): Promise<any> {
    const { status, data } = await this.httpService.get(`https://api.spotify.com/v1/users/${user.name}/playlists`, {
      headers: {
        Authorization: `Bearer ${user.spotifyAccessToken}`
      }
    }).toPromise()

    return data.items
  }
}
