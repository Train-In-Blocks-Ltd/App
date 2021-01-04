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
    <div v-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === true /*&& $parent.$parent.pwa.installed === false*/">
      <p class="text--large">Install the app to your home screen</p>
      <p class="text--large grey">If this doens't work, follow the instructions below</p><br><br>
      <p class="text--small">IOS</p>
      <p class="text--small grey">Tap the 'Share' button, then 'Add to Home Screen'</p><br><br>
      <p class="text--small">Android</p>
      <p class="text--small grey">Tap the options icon on your browser, then press 'Add to home screen'</p>
    </div>
    <p
      v-else-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === false /*&& $parent.$parent.pwa.installed === true*/"
      class="text--large"
    >
      We can't detect if you have the app installed. Try launching the app, or continue using it in the browser.
    </p>
    <p
      v-else
      class="text--large"
    >
      Your device doesn't support Progressive Web Apps
    </p>
    <div class="bottom_bar">
      <button
        v-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === true /*&& $parent.$parent.pwa.installed === false*/"
        @click="installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)"
      >
        Download
      </button>
      <a
        v-else-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === false /*&& $parent.$parent.pwa.installed === true*/"
        href="https://app.traininblocks.com"
        target="_blank"
      >
        <button>
          Launch
        </button>
      </a>
      <button @click="$parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
    </div><br><br>
  </div>
</template>

<script>
  export default {
    methods: {
      installPWA () {
        // Hide the app provided install promotion
        this.$parent.$parent.pwa.canInstall = false
        // Show the install prompt
        this.$parent.$parent.pwa.deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        this.$parent.$parent.pwa.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
          } else {
            this.$parent.$parent.pwa.canInstall = true
          }
        })
      }
    }
  }
</script>