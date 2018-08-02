import { Playlist } from "../interfaces/playlist.interface";

export class PlaylistDto {
  constructor (playlist?: Playlist) {
    this.id = playlist._id;
    this.name = playlist.name;
    this.description = playlist.description;
    this.length = playlist.length;
    this.img = playlist.img;
    this.color = playlist.color;
    this.featured = playlist.featured;
  }

  static fromSpotifyPlaylist(playlist: any): any {
    const dto: PlaylistDto = {
      id: playlist.id,
      name: playlist.name,
      description: '',
      length: 0,
      img: '',
      color: '',
      featured: false
    }

    return dto;
  }

  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly length: number;
  readonly img: string;
  readonly color: string;
  readonly featured: boolean;
}
