<style lang="scss" scoped>
.logout_message {
  margin-top: 10vh;
  .logout_message__top {
    display: flex;
    svg {
      margin-right: 2rem;
    }
  }
}
@media (max-width: 768px) {
  .logout_message__top {
    display: grid;
    grid-gap: 2rem;
  }
}
</style>
<template>
  <div id="logout" class="view_container">
    <div class="logout_message">
      <div class="logout_message__top">
        <inline-svg :src="require('../assets/svg/logout_success.svg')" />
        <div>
          <h1>You have been logged out successfully</h1>
          <br />
          <h3 class="grey">See you next time</h3>
          <br /><br />
          <h3>You will be redirected automatically</h3>
          <a href="/" class="grey">Click here if it takes too long</a>
        </div>
      </div>
    </div>
  </div>
</template>
