import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlaylistSchema } from "./schemas/playlist.schema";
import { PlaylistService } from "./services/playlist.service";
import { TrackSchema } from "./schemas/track.schema";
import { PlaylistController } from "./playlist.controller";
import { SpotifyModule } from "../spotify/spotify.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Playlist', schema: PlaylistSchema },
      { name: 'Track', schema: TrackSchema }
    ]),
    SpotifyModule
  ],
  controllers: [
    PlaylistController
  ],
  providers: [
    PlaylistService
  ],
  exports: [
    PlaylistService,
    MongooseModule.forFeature([
      { name: 'Playlist', schema: PlaylistSchema },
    ])
  ]
})
export class PlaylistModule { }
