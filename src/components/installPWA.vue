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
    <div v-if="pwa.displayMode === 'browser tab' && pwa.canInstall === true && pwa.installed === false">
      <p class="text--large">Install the app</p>
      <p class="text--large grey">Available for desktops and mobiles</p>
      <button @click="$parent.$parent.installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)">
        Install
      </button>
    </div>
    <div v-else-if="pwa.displayMode === 'browser tab' && pwa.canInstall === true && pwa.installed === true">
      <p class="text--large">You have the app installed already...</p>
      <button @click="$parent.$parent.installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)">
        Launch
      </button>
    </div>
    <div v-else-if="pwa.displayMode === 'browser tab' && pwa.canInstall === false && pwa.installed === false">
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
    data () {
      return {
        pwa: {
          deferredPrompt: null,
          displayMode: 'browser tab',
          canInstall: false,
          installed: false
        }
      }
    },
    mounted () {
      const self = this
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later.
        self.deferredPrompt = e
        // Update UI notify the user they can install the PWA
        this.pwa.canInstall = true
      })
      if (navigator.standalone) {
        this.pwa.displayMode = 'standalone-ios'
      }
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.pwa.displayMode = 'standalone'
      }
      if ('getInstalledRelatedApps' in navigator) {
        const self = this
        navigator.getInstalledRelatedApps().then((relatedApps) => {
          console.log(relatedApps)
          if (relatedApps.length) {
            self.pwa.installed = true
          }
        })
      }
    },
    methods: {
      installPWA () {
        // Hide the app provided install promotion
        this.pwa.canInstall = false
        // Show the install prompt
        this.deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt')
          } else {
            console.log('User dismissed the install prompt')
            this.pwa.canInstall = true
          }
        })
      }
    }
  }
</script>