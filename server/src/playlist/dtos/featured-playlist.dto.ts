import { FeaturedPlaylist } from "../interfaces/featured-playlist.interface";

export class FeaturedPlaylistDto {
  constructor (playlist: FeaturedPlaylist) {
    this.id = playlist._id;
    this.name = playlist.name;
    this.description = playlist.description;
    this.length = playlist.length;
    this.img = playlist.img;
    this.color = playlist.color;
  }

  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly length: number;
  readonly img: string;
  readonly color: string;
}
