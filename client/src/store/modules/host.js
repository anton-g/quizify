import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

import * as types from '../mutation-types'

import { HOST_SOCKET_STORAGE_ITEM } from '../../common/constants'

const socketBus = new Vue()

const state = {
  playlist: undefined,
  quiz: undefined,
  buzzedPlayer: undefined,
  result: [],
  featuredPlaylists: [
    {
      name: 'Alla ska med',
      length: 23,
      img: 'https://mosaic.scdn.co/640/11b1054a8d4b86106085ec30073e50e6f584639e6be8b8cd5690385c28304aafc58ace5ce6dbdc977c6ab0bd116e14ecdd58299a1d103df4e195ac2d93e156ad7762357bea213e53cf346e5f8fe3efae'
    },
    {
      name: 'Dansband gör covers',
      length: 54,
      img: 'https://i.scdn.co/image/8cb5ccc8a642e06a69dbdb2f0c47d597057cb3b1'
    },
    {
      name: 'Generationsquiz',
      length: 301,
      img: 'https://mosaic.scdn.co/640/2993cba1f3c5e99613b7c5d1cc7df07e7d71cb8679970c9df607f89a5895e9b1aac1f4d1b5281d197c99322cf4f696082b86d92a5e4ab93e6cc49bfafa75bec32c71f5f4339c41b6ca816f4dd4cac111'
    }
  ],
  playlists: [
    {
      name: 'Julquiz',
      length: 10
    },
    {
      name: 'Amanda 25',
      length: 18
    },
    {
      name: 'Lajvet',
      length: 22
    },
    {
      name: 'Always bushes of seagulls',
      length: 10
    },
    {
      name: 'Sümmer',
      length: 199
    },
    {
      name: 'Och vi ska också glömmas bort',
      length: 98
    }
  ]
}

const getters = {
  hasActiveQuiz (state, getters, rootState) {
    return rootState.common.connected && !!state.quiz
  },
  isBuzzed (state) {
    return !!state.buzzedPlayer
  },
  isPaused (state) {
    return !!state.quiz && state.quiz.state === 'PAUSED'
  },
  finalQuestion (state) {
    return !!state.quiz && state.quiz.currentQuestionNo === state.quiz.questions.length
  },
  currentQuestion (state) {
    if (state.quiz) {
      return state.quiz.questions[state.quiz.currentQuestionNo - 1]
    }
  }
}

const mutations = {
  [types.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  },
  [types.SET_QUIZ] (state, quiz) {
    state.quiz = quiz
  },
  [types.UPDATE_QUIZ] (state, update) {
    state.quiz = {
      ...state.quiz,
      ...update
    }
  },
  [types.UPDATE_PLAYER] (state, player) {
    const idx = state.quiz.players.findIndex(p => p.id === player.id)
    if (idx > -1) {
      state.quiz.players[idx] = player
    }
  },
  [types.SET_BUZZED_PLAYER] (state, player) {
    state.buzzedPlayer = player
  },
  [types.SET_RESULT] (state, result) {
    state.result = result
  },
  [types.CLEANUP_HOST] (state) {
    state.playlist = undefined
    state.quiz = undefined
    state.buzzedPlayer = undefined
    state.result = []
  }
}

const actions = {
  login () {
    // todo lot of spotify stuff
    router.push({ name: 'host-create' })
  },
  selectPlaylist ({ commit }, playlist) {
    commit(types.SET_PLAYLIST, playlist)
  },
  async create ({ commit }) {
    const { status, data } = await axios.post(`http://localhost:3000/game`)

    if (status !== 201 || data.error) {
      console.log('error')
      return
    }

    commit(types.SET_QUIZ, data)
    // TODO loading indicator
    // TODO maybe have a timeout here to check if something goes wrong with socket?

    socketBus.$socket.emit('HOST', {
      key: data.key,
      secret: data.secret
    }, (res) => {
      commit(types.SET_QUIZ, res)
      router.push({ name: 'host-lobby' })

      localStorage.setItem(HOST_SOCKET_STORAGE_ITEM, socketBus.$socket.id)
    })
  },
  async reconnectHost ({ commit, state }, socket) {
    socketBus.$socket.emit('RECONN_H', socket, (quiz) => {
      if (!quiz) {
        console.log('Could not reconnect.. :(')
        return
      }

      console.log('Successfully reconnected! Restoring game state..')
      commit(types.SET_QUIZ, quiz)
      // TODO TEMP, remove when playlist is saved on server
      commit(types.SET_PLAYLIST, state.playlists[0])

      if (quiz.state === 'LOBBY') {
        router.push({ name: 'host-lobby' })
      } else if (quiz.state === 'PLAYING' || quiz.state === 'PAUSED') {
        router.push({ name: 'host-play' })
      } else {
        // TODO handle other states
        console.log('-unknown state-')
      }

      localStorage.setItem(HOST_SOCKET_STORAGE_ITEM, socketBus.$socket.id)
    })
  },
  async start ({ state, commit }) {
    socketBus.$socket.emit('START', state.quiz.key, (quiz) => {
      commit(types.SET_QUIZ, quiz)
      router.push({ name: 'host-play' })
    })
  },
  resetBuzz ({ commit }) {
    commit(types.SET_BUZZED_PLAYER, undefined)
    socketBus.$socket.emit('RESUME', state.quiz.key)
  },
  score ({ state, commit }) {
    socketBus.$socket.emit('SCORE', state.buzzedPlayer.id, (player) => {
      commit(types.UPDATE_PLAYER, player)
      socketBus.$socket.emit('RESUME', state.quiz.key)
    })
  },
  pause ({ state, commit }) {
    socketBus.$socket.emit('PAUSE', state.quiz.key, (quiz) => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  resume ({ state, commit }) {
    socketBus.$socket.emit('RESUME', state.quiz.key, (quiz) => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  prevQuestion ({ state, commit }) {
    socketBus.$socket.emit('PREV_QUESTION', state.quiz.key, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  nextQuestion ({ state, commit }) {
    socketBus.$socket.emit('NEXT_QUESTION', state.quiz.key, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  endQuiz ({ state, commit }) {
    socketBus.$socket.emit('END_GAME', state.quiz.key, response => {
      commit(types.SET_RESULT, response.results)
      router.push({ name: 'host-end' })
    })

    localStorage.removeItem(HOST_SOCKET_STORAGE_ITEM)
  },
  cleanupHost ({ commit }) {
    commit(types.CLEANUP_HOST)
  },
  socket_update: ({ commit }, update) => {
    commit(types.UPDATE_QUIZ, update)
  },
  socket_buzzed: ({ state, commit }, playerId) => {
    const player = state.quiz.players.find(p => p.id === playerId)
    console.log(`${player.name} buzzed`)

    commit(types.SET_BUZZED_PLAYER, player)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
