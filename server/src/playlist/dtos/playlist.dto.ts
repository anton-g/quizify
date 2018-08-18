import { Playlist } from "../interfaces/playlist.interface";

export class PlaylistDto {
  constructor (playlist?: Playlist) {
    if (!playlist) {
      return
    }

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
      description: playlist.description,
      length: playlist.tracks.total,
      img: playlist.images.length > 1 ? playlist.images[0].url : '',
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
