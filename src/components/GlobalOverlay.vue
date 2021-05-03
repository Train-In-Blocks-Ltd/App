<style scoped>
.overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
