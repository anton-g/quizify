import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
  playlist: undefined,
  quiz: undefined,
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
    })
  },
  async start ({ state, commit }) {
    socketBus.$socket.emit('START', state.quiz.key, (quiz) => {
      commit(types.SET_QUIZ, quiz)
      router.push({ name: 'host-play' })
    })
  },
  socket_update: ({ commit }, update) => {
    commit(types.UPDATE_QUIZ, update)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
