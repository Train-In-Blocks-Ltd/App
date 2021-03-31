<style scoped>
.overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000060
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
      this.will_body_scroll(!this.show)
    }
  }
}
</script>
