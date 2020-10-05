<template>
  <div>
    <p v-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall !== true" class="text--large">Install the app</p>
    <p v-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall !== true" class="text--large grey">Available for desktops and mobiles</p>
    <p v-if="$parent.$parent.pwa.displayMode === 'browser tab' && $parent.$parent.pwa.canInstall === true" class="text--large">You have the app installed already...</p>
    <br><br>
    <button @click="$parent.$parent.installPWA(), $parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)" v-if="$parent.$parent.pwa.displayMode === 'browser tab'">
      {{runOrInstallApp($parent.$parent.pwa.canInstall)}}
    </button>
    <button @click="$parent.isInstallOpen = false, $parent.$parent.willBodyScroll(true)" class="cancel">Close</button>
  </div>
</template>

<script>
  export default {
    methods: {
      runOrInstallApp (state) {
        if (!state) {
          return 'Download'
        } else {
          return 'Launch'
        }
      }
    }
  }
</script>>