<style scoped>
  p.text--large {
    margin: 1rem 0
  }
  p.text--large:first-of-type {
    margin-top: 0
  }
</style>

<template>
  <div>
    <div v-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === true && $parent.$parent.pwa.installed === false">
      <p class="text--large">Install the app</p>
      <p class="text--large grey">Available for desktops and mobiles</p>
      <button @click="installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)">
        Install
      </button>
    </div>
    <div v-else-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === false && $parent.$parent.pwa.installed === true">
      <p class="text--large">You have the app installed already...</p>
      <button @click="installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)">
        Launch
      </button>
    </div>
    <div v-else-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === false && $parent.$parent.pwa.installed === false">
      <p class="text--large">Your device doesn't support Progressive Web Apps</p>
    </div>
    <div v-else>
      <p class="text--large">Congratulations. You have launched the app natively</p>
    </div>
    <button @click="$parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
  </div>
</template>

<script>
  export default {
    async mounted () {
      if (navigator.standalone) {
        this.$parent.$parent.pwa.displayMode = 'standalone-ios'
      }
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.$parent.$parent.pwa.displayMode = 'standalone'
      }
      if ('getInstalledRelatedApps' in navigator) {
        const self = this
        const relatedApps = await navigator.getInstalledRelatedApps()
        if (relatedApps.length > 0) {
          self.$parent.$parent.pwa.installed = true
        }
      }
    },
    methods: {
      installPWA () {
        // Hide the app provided install promotion
        this.$parent.$parent.pwa.canInstall = false
        // Show the install prompt
        this.$parent.$parent.pwa.deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        this.$parent.$parent.pwa.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt')
          } else {
            console.log('User dismissed the install prompt')
            this.$parent.$parent.pwa.canInstall = true
          }
        })
      }
    }
  }
</script>