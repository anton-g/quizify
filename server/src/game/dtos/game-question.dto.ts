import { Track } from "../../playlist/interfaces/track.interface";

export class GameQuestionDto {
  constructor(track: Track) {
    this.question = track.question,
    this.track = {
      name: track.name,
      artist: track.artist,
      imageUrl: track.imageUrl
    }
  }

  readonly question: string;
  readonly track: {
    readonly name: string;
    readonly artist: string;
    readonly imageUrl: string;
  }
}
