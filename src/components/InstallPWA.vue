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
    <div v-if="pwa.canInstall">
      <h2>
        Save the app to your home screen
      </h2>
      <p class="text--small grey">
        Access it quickly with a clearer interface
      </p>
    </div>
    <h2 v-else-if="pwa.installed">
      You have the app saved to your mobile already!
    </h2>
    <div v-else-if="!pwa.canInstall">
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
          <img
            :src="require('../assets/install/1.jpg')"
            alt="Open share menu"
            loading="lazy"
          >
          <img
            :src="require('../assets/install/2.jpg')"
            alt="Add to home screen"
            loading="lazy"
          >
        </div>
      </div>
    </div>
    <div class="install_bottom_bar">
      <button
        v-if="pwa.canInstall"
        @click="installPWA(), $parent.isInstallOpen = false, willBodyScroll(true)"
      >
        Install
      </button>
      <a
        v-else-if="!pwa.canInstall && pwa.installed"
        href="https://app.traininblocks.com"
        target="_blank"
      >
        <button>
          Launch
        </button>
      </a>
      <button class="red_button" @click="$parent.isInstallOpen = false, willBodyScroll(true)">
        Close
      </button>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState([
    'pwa'
  ]),
  methods: {
    installPWA () {
      // Show the install prompt
      this.pwa.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.pwa.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Hide the app provided install promotion
          this.$store.commit('setDataDeep', {
            attrParent: 'pwa',
            attrChild: 'canInstall',
            data: false
          })
          this.$store.commit('setDataDeep', {
            attrParent: 'pwa',
            attrChild: 'displayMode',
            data: 'standalone'
          })
        } else {
          this.$store.commit('setDataDeep', {
            attrParent: 'pwa',
            attrChild: 'canInstall',
            data: true
          })
        }
      })
    }
  }
}
</script>
