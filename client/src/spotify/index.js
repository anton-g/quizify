const Spotify = require('spotify-web-api-js')
const s = new Spotify()

const SpotifyHandler = {
  getUserPlaylists (token) {
    s.setAccessToken(token)
    return s.getUserPlaylists()
  }
}

export default SpotifyHandler
