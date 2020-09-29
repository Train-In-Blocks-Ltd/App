<style scoped>
  .client_link {
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    box-shadow: 0 0 20px 10px #28282810;
    border-radius: 3px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:not(.archived):hover {
    transform: scale(1.02)
  }
  .client_link:not(.archived):active {
    transform: scale(1)
  }
  .client_name {
    margin: 0
  }
  .client_link svg {
    width: 20px;
    fill: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover svg {
    fill: #282828
  }
  .client_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .client_link__notes__content * {
    color: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content * {
    color: #282828
  }
  .client_link__notes__content p {
    margin: .4rem 0
  }
  .client_link__notes__content h1, .client_link__notes__content h2 {
    font-size: 1rem
  }
  .client_link__notes__content img {
    margin: 1rem 0;
    max-width: 100%;
    opacity: .6;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content img {
    opacity: 1
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
  <div class="client_link">
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