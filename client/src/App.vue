<template lang="pug">
  #app
    .container
      router-view
</template>

<script>
export default {
  name: 'app',
  // TODO when refreshing page, restore state from session storage and rejoin quiz
  // For quiz host: Send back secret token from server to know which quiz to join
  socket: {
    disconnect () {
      console.log('disconnect')
    },
    connect_error () {
      console.log('c_error')
    },
    error () {
      console.log('error')
    },
    reconnect_error () {
      console.log('reconnect_error')
    },
    reconnect_failed () {
      console.log('reconnect_failed')
    },
    connect_timeout () {
      console.log('connect_timeout')
    }
  },
  created () {
    /*
    const userId = sessionStorage.getItem('userId')
    const quizId = sessionStorage.getItem('quizId')
    console.log('userId', userId)
    console.log('quizId', quizId)
    if (userId.length > 0 && quizId.length > 0) {
      this.$socket.emit('user_reconnect', quizId, userId, result => {
        console.log('successfully reconnected: ', result)
      })
    }
    */
  }
}
</script>

<style lang="sass" src="bulma"></style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Pacifico');

html, body {
  width: 100%;
  height: 100%;
}

h1,h2,h3,h4,h5,p,span {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);
}

#app {
  min-height: 100%;
  background: linear-gradient(to right, #ee0979, #ff6a00); //linear-gradient(to right, #f2994a, #f2c94c);
  display: flex;

  .container {
    max-width: 500px;
    margin: 1rem auto;
  }
}
</style>
