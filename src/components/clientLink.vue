<style scoped>

  /* SEE HOME.VUE FOR MORE CSS */

  /* Client Link */
  .client_link svg {
    width: 20px;
    fill: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover svg {
    fill: #282828
  }
  .client_link__details {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 1rem
  }
  .client_link__details p {
    margin: auto 0;
    color: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__details p {
    color: #282828
  }
</style>

<template>
  <div>
    <div>
      <p class="text--small">{{name}}</p>
      <div v-if="email !== ''" class="client_link__details">
        <inline-svg :src="require('../assets/svg/email.svg')" />
        <p>{{email}}</p>
      </div>
      <div v-if="number !== ''" class="client_link__details">
        <inline-svg :src="require('../assets/svg/mobile.svg')" />
        <p>{{number}}</p>
      </div>
    </div>
    <div v-if="notes !== ''" v-html="notes" class="client_link__notes__content" />
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg
    },
    props: ['name', 'email', 'number', 'notes']
  }
</script>