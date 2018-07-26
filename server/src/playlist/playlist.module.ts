import { Module } from "@nestjs/common";
import { PlaylistController } from "./playlist.controller";
import { MongooseModule } from "../../node_modules/@nestjs/mongoose";
import { FeaturedPlaylistSchema } from "./schemas/FeaturedPlaylist";
import { PlaylistService } from "./services/playlist.service";

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'FeaturedPlaylist', schema: FeaturedPlaylistSchema }
  ])],
  controllers: [PlaylistController],
  providers: [PlaylistService]
})
export class PlaylistModule { }
