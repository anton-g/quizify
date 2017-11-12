const AuthHandler = {
  clientId: 'bd25fd9aac2a43fc8a219178ccec06c0',
  redirectUrl: 'http://localhost:8080/create',
  scope: 'user-read-email',
  // TODO add ?state

  login () {
    window.location = `https://accounts.spotify.com/authorize?response_type=token&client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${this.redirectUrl}`
  },

  loginCallback (hash) {
    const params = this.getHashParams(hash)
    return params.access_token !== undefined && params.access_token.length > 0
  },

  getHashParams (hash) {
    let hashParams = {}

    let r = /([^&;=]+)=?([^&;]*)/g
    let q = hash.substring(1)

    let e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2])
      e = r.exec(q)
    }

    return hashParams
  }

}

export default AuthHandler
