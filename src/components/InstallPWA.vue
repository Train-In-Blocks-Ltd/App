<style lang="scss" scoped>
.instructions {
  margin-top: 2rem;
  .img_container {
    display: flex;
    margin-top: 2rem;
    img {
      border-radius: 10px;
      width: 25%;
      &:first-child {
        margin-right: 1rem
      }
    }
  }
}
.install_bottom_bar {
  margin-top: 2rem
}

@media (max-width: 1440px) {
  .instructions {
    .img_container {
      img {
        width: 30%
      }
    }
  }
}
@media (max-width: 992px) {
  .instructions {
    .img_container {
      img {
        width: 40%
      }
    }
  }
}
@media (max-width: 768px) {
  .instructions {
    .img_container {
      img {
        width: 50%
      }
    }
  }
}
@media (max-width: 576px) {
  .instructions {
    .img_container {
      display: grid;
      grid-gap: 2rem;
      margin: 4rem 0;
      img {
        width: 100%;
        &:first-child {
          margin-right: 0
        }
      }
    }
  }
  .install_bottom_bar {
    display: grid;
    grid-gap: 1rem;
    button {
      width: 100%
    }
  }
}
</style>

<template>
  <div>
    <inline-svg
      v-if="!pwa.canInstall && !pwa.installed"
      class="close_icon cursor"
      :src="require('../assets/svg/close.svg')"
      aria-label="Close"
      @click="$parent.isInstallOpen = false, willBodyScroll(true)"
    />
    <div v-if="pwa.canInstall">
      <h2>
        Save the app to your home screen
      </h2>
      <p class="text--small grey">
        Access it quickly with a clearer interface
      </p>
    </div>
    <div v-else-if="pwa.installed">
      <h2>
        You have the app saved to your mobile already!
      </h2>
      <p class="text--small grey">
        Launch it or keep using it in the browser
      </p>
    </div>
    <div v-else-if="!pwa.canInstall">
      <h2>
        Save the app to your home screen
      </h2>
      <p class="text--small grey">
        or continue using it in the browser
      </p>
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
      <button
        v-if="pwa.canInstall || pwa.installed"
        class="red_button"
        @click="$parent.isInstallOpen = false, willBodyScroll(true)"
      >
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

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Shows the install PWA prompt.
     */
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
