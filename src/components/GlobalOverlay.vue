<style lang="scss" scoped>
.overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  background-color: #00000080
}
</style>

<template>
  <div v-if="show" class="overlay" />
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  watch: {
    show () {
      this.willBodyScroll(!this.show)
    }
  }
}
</script>
