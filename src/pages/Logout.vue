<style scoped>
  #logout {
    z-index: 999
  }
  .logout_message {
    margin-top: 10vh
  }
  .logout_message__top {
    display: flex
  }
  .logout_message__top svg {
    margin-right: 2rem
  }
  @media (max-width: 768px) {
    .logout_message__top {
      display: grid;
      grid-gap: 2rem
    }
  }
</style>
<template>
  <div id="logout">
    <div class="logout_message">
      <div class="logout_message__top">
        <inline-svg :src="require('../assets/svg/logout_success.svg')" />
        <div>
          <p class="text--large">You have been logged out successfully</p>
          <p class="text--large grey">See you next time</p><br><br>
          <p class="text--small">You will be redirected automatically</p>
          <a href="http://app.traininblocks.com" class="text--small grey">Click here if it takes too long</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'
  export default {
    components: {
      InlineSvg
    }
  }
</script>