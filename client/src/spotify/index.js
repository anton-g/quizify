const Spotify = require('spotify-web-api-js')
const s = new Spotify()

const SpotifyHandler = {
  getUserPlaylists (token) {
    s.setAccessToken(token)
    return s.getUserPlaylists()
  },
  getPlaylistTracks (playlist) {
    // TODO currently only gets the top 100 tracks
    return s.getPlaylistTracks(playlist.owner.id, playlist.id)
  },
  getUserDevices () {
    return s.getMyDevices()
  },
  playTrack (track) {
    s.play({
      uris: [
        track.uri
      ]
    })
  },
  pause () {
    s.pause({})
  },
  resume () {
    s.play({})
  }
}

export default SpotifyHandler
