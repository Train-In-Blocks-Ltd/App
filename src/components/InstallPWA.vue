<style scoped>
  .cancel {
    z-index: 99;
    display: block
  }
  .install_bottom_bar {
    margin-top: 2rem
  }
</style>

<template>
  <div>
    <div v-if="$parent.$parent.pwa.canInstall">
      <h1>
        Install the app
      </h1>
      <h2 class="grey">
        Access it quickly from your home screen with a clearer interface
      </h2>
    </div>
    <div v-else-if="!$parent.$parent.pwa.canInstall">
      <h1>
        We can't detect if you have the app installed
      </h1>
      <h2 class="grey">
        Try launching the app, or continue using it in the browser
      </h2>
    </div>
    <h1 v-else-if="$parent.$parent.pwa.installed">
      You have the app installed!
    </h1>
    <div class="install_bottom_bar">
      <button
        v-if="$parent.$parent.pwa.canInstall"
        @click="installPWA(), $parent.isInstallOpen = false, will_body_scroll(true)"
      >
        Install
      </button>
      <a
        v-else-if="!$parent.$parent.pwa.canInstall || $parent.$parent.pwa.installed"
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
