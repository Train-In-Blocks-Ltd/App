<template>
  <div style="display: grid; place-items: center; min-height: 100vh; min-height: -webkit-fill-available">
    <p style="font-size: 2.5rem">
      Error 404 Page Not Found
    </p>
  </div>
</template>

<script>
export default {
  created () {
    this.willBodyScroll(true)
  }
}
</script>
