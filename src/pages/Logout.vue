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
          <h1>
            You have been logged out successfully
          </h1><br>
          <h2 class="grey">
            See you next time
          </h2><br><br>
          <h2>
            You will be redirected automatically
          </h2>
          <a href="/" class="grey">Click here if it takes too long</a>
        </div>
      </div>
    </div>
  </div>
</template>
