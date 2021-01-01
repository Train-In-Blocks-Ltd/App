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
    <p class="text--large">Install the app to your home screen</p>
    <p class="text--large grey">If this doens't work, follow the instructions below</p><br><br>
    <p class="text--small">IOS</p>
    <p class="text--small grey">Tap the 'Share' button, then 'Add to Home Screen'</p><br><br>
    <p class="text--small">Android</p>
    <p class="text--small grey">Tap the options icon on your browser, then press 'Add to home screen'</p>
    <div class="bottom_bar">
      <button @click="installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)">
        Download
      </button>
      <button @click="$parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
    </div><br><br>
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
          } else {
          }
        })
      }
    }
  }
</script>