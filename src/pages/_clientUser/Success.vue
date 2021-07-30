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
    <router-link to="/clientUser" class="a_link">
      <b>Back to the app</b>
    </router-link>
  </div>
</template>

<script>
export default {
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    await this.$parent.getClientSideData()
    this.$store.dispatch('endLoading')
  }
}
</script>
