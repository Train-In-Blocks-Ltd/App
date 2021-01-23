<style scoped>
  p.text--large {
    margin: 1rem 0
  }
  p.text--large:first-of-type {
    margin-top: 0
  }
  .cancel {
    z-index: 99;
    display: block
  }
</style>

<template>
  <div>
    <div v-if="$parent.$parent.pwa.canInstall === true">
      <p class="text--large">
        Install the app
      </p>
      <p class="text--large grey">
        Access it quickly from your home screen with a clearer interface
      </p>
    </div>
    <div v-else-if="$parent.$parent.pwa.canInstall === false">
      <p class="text--large">
        We can't detect if you have the app installed
      </p>
      <p class="text--large grey">
        Try launching the app, or continue using it in the browser
      </p>
    </div>
    <p
      v-else-if="$parent.$parent.pwa.installed === true"
      class="text--large"
    >
      You have the app installed!
    </p>
    <div class="bottom_bar">
      <button
        v-if="$parent.$parent.pwa.canInstall === true"
        @click="installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)"
      >
        Install
      </button>
      <a
        v-else-if="$parent.$parent.pwa.canInstall === false || $parent.$parent.pwa.installed === true"
        href="https://app.traininblocks.com"
        target="_blank"
      >
        <button>
          Launch
        </button>
      </a>
      <button class="cancel" @click="$parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)">
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
