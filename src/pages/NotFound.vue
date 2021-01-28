<template>
  <div style="display: grid; place-items: center; height: 100vh">
    <p style="font-size: 2.5rem">
      Error 404 Page Not Found
    </p>
  </div>
</template>

<script>
export default {
  created () {
    this.$parent.setup()
    this.$parent.willBodyScroll(true)
  }
}
</script>
