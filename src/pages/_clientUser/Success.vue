<style lang="scss" scoped>
#success {
  display: grid;
  grid-gap: 2rem;
  .a_link {
    width: fit-content
  }
}
</style>

<template>
  <div id="success" class="view_container">
    <h1>All done...</h1>
    <p class="text--small grey">
      Your payment was made successfully, your trainer will be notified.
    </p>
    <p class="grey">
      Redirecting in {{ timeout }}
    </p>
    <p class="grey">
      If your browser does not automatically redirect you, please click here...
    </p>
    <router-link to="/clientUser" class="a_link">
      <b>Back to the app</b>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeout: 5
    }
  },
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    await this.$parent.getClientSideData()
    this.$store.dispatch('endLoading')
  },
  mounted () {
    const self = this
    setInterval(
      function () {
        self.timeout = self.timeout - 1
      }, 1000
    )
    setTimeout(
      function () {
        self.router.push('clientUser')
      }, 5000
    )
  }
}
</script>
