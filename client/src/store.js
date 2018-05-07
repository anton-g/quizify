import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    joinQuiz ({ commit, state }, { key, name}) {
      axios.post(`http://localhost:3000/game/${key}/join`, {
        name: name
      })
      .then(({ status, data }) => {
        if (status !== 200 || data.error) {
          return
        }

        console.log(data)
      })
    }
  },
});
