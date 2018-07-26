export enum GameState {
  Created = "CREATED",
  Lobby = "LOBBY",
  Playing = "PLAYING",
  Paused = "PAUSED",
  Ended = "ENDED"
}

export enum GameEvents {
  Host = "HOST",
  Update = "UPDATE",
  Start = "START",
  Pause = "PAUSE",
  Resume = "RESUME",
  Join = "JOIN",
  Buzz = "BUZZ",
  Buzzed = "BUZZED",
  Score = "SCORE",
  Scored = "SCORED",
  ReconnectPlayer = "RECONN_P",
  ReconnectHost = "RECONN_H",
  NextQuestion = "NEXT_QUESTION",
  PrevQuestion = "PREV_QUESTION",
  EndGame = "END_GAME"
}
