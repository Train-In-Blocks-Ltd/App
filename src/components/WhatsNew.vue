<template>
  <div>
    <p class="text--large">
      What's new in {{ $parent.$parent.versionName }} {{ $parent.$parent.versionBuild }}?
    </p>
    <p class="text--large grey">
      Speed and mobile-friendly
    </p>
    <br><br>
    <p class="text--small">
      New editor
    </p>
    <p class="text--small grey">
      Try our new text editor. It's faster and more convenient. You can now access templates for your sessions in the toolbar with additional support for use on mobile devices.<br><br>**We recommend that you create new sessions and copy it over from your current plans**
    </p><br><br>
    <p class="text--small">
      Updated graph
    </p>
    <p class="text--small grey">
      We've made our line-chart more interactive and responsive. You can now click on a point to get the value and find out where it occurred.
    </p><br><br>
    <p class="text--small">
      Client-side improvements
    </p>
    <p class="text--small grey">
      Your clients will now enjoy a smoother and faster interface. With access to the portfolio, they can get additional information about your services such as transformations, payments and plans.
    </p><br><br>
    <br>
    <button class="cancel" @click="$parent.isWhatsNewOpen = false, $parent.$parent.willBodyScroll(true), update_version()">
      Close
    </button>
  </div>
</template>

<script>
  export default {
    methods: {
      update_version () {
        localStorage.setItem('versionBuild', this.$parent.$parent.versionBuild)
        this.$parent.$parent.newBuild = false
      }
    }
  }
</script>