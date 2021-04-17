<style scoped>
.cancel {
  z-index: 99;
  display: block
}
.install_bottom_bar {
  margin-top: 2rem
}
.instructions {
  margin-top: 2rem
}
.img_container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  margin-top: 2rem
}
.img_container img {
  border-radius: 10px;
  max-width: 100%
}
@media (max-width: 576px) {
  button {
    width: 100%
  }
  .install_bottom_bar {
    display: grid;
    grid-gap: 1rem
  }
}
</style>

<template>
  <div>
    <div v-if="$parent.$parent.pwa.canInstall">
      <h2>
        Save the app to your home screen
      </h2>
      <h3 class="grey">
        Access it quickly with a clearer interface
      </h3>
    </div>
    <h2 v-else-if="$parent.$parent.pwa.installed">
      You have the app saved to your mobile already!
    </h2>
    <div v-else-if="!$parent.$parent.pwa.canInstall">
      <h2>
        Save the app to your home screen
      </h2>
      <h3 class="grey">
        or continue using it in the browser
      </h3>
      <div class="instructions">
        <p><b>For Safari</b></p>
        <p>1. Open the <i>Share</i> menu at the bottom of the screen</p>
        <p>2. Select <i>Add to Home Screen</i></p>
        <div class="img_container">
          <img :src="require('../assets/install/1.jpg')" alt="Open share menu">
          <img :src="require('../assets/install/2.jpg')" alt="Add to home screen">
        </div>
      </div>
    </div>
    <div class="install_bottom_bar">
      <button
        v-if="$parent.$parent.pwa.canInstall"
        @click="installPWA(), $parent.isInstallOpen = false, will_body_scroll(true)"
      >
        Install
      </button>
      <a
        v-else-if="!$parent.$parent.pwa.canInstall && $parent.$parent.pwa.installed"
        href="https://app.traininblocks.com"
        target="_blank"
      >
        <button>
          Launch
        </button>
      </a>
      <button class="red_button" @click="$parent.isInstallOpen = false, will_body_scroll(true)">
        Close
      </button>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  methods: {
    installPWA () {
      // Show the install prompt
      this.$parent.$parent.pwa.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.$parent.$parent.pwa.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Hide the app provided install promotion
          this.$parent.$parent.pwa.canInstall = false
          this.$parent.$parent.pwa.displayMode = 'standalone'
        } else {
          this.$parent.$parent.pwa.canInstall = true
        }
      })
    }
  }
}
</script>
