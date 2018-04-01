export enum GameState {
  Created = "CREATED",
  Lobby = "LOBBY",
  Playing = "PLAYING",
  Paused = "PAUSED",
  Done = "DONE"
}

export enum GameEvents {
  Host = "HOST",
  Update = "UPDATE",
  Start = "START",
  Pause = "PAUSE",
  Resume = "RESUME",
  Join = "JOIN",
  Buzz = "BUZZ",
  Score = "SCORE"
}
