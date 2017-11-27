const Spotify = require('spotify-web-api-js')
const s = new Spotify()

const SpotifyHandler = {
  getUserPlaylists (token) {
    s.setAccessToken(token)
    return s.getUserPlaylists()
  },
  getPlaylistTracks (playlist, token) {
    s.setAccessToken(token)
    // TODO currently only gets the top 100 tracks
    return s.getPlaylistTracks(playlist.owner.id, playlist.id)
  }
}

export default SpotifyHandler
