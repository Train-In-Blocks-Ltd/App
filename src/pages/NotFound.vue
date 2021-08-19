<style scoped lang="scss">
  .error404 {
    display: grid;
    place-items: center;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    min-height: calc(100vh - env(safe-area-inset-bottom));
    p {
      font-size: 2.5rem
    }
  }
</style>
<template>
  <div class="error404">
    <p>
      Error 404 Page Not Found
    </p>
  </div>
</template>

<script>
export default {
  metaInfo  () {
    return {
      title: '404 Not Found'
    }
  },
  created () {
    this.willBodyScroll(true)
  }
}
</script>
