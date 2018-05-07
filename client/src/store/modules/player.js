import axios from 'axios'

import * as types from '../mutation-types'

const state = {
}

const getters = {
}

const mutations = {
  [types.PLAYER_JOIN] (state, player) {
  }
}

const actions = {
  joinQuiz ({ commit, state }, { key, name }) {
    axios.post(`http://localhost:3000/game/${key}/join`, {
      name: name
    }).then(({ status, data }) => {
      if (status !== 200 || data.error) {
        console.log('error')
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
