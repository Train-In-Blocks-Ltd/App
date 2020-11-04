<style scoped>
  /* SEE HOME.VUE FOR MORE CSS */

  /* Client Link */
  .client_link svg {
    width: 20px;
    fill: #282828;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link__details {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 1rem
  }
  .client_link__details p, .name {
    overflow-wrap: break-word;
    word-wrap: break-word;
    margin: auto 0;
    color: #282828;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link__details img, .client_link__details iframe {
    border-radius: 3px
  }
  .client_link.archived .client_link__details p, .client_link.archived .name {
    color: #282828
  }
  .client_link.archived svg {
    fill: #282828
  }

  @media (min-width: 768px) {
    .client_link__options {
      display: flex;
      flex-direction: column
    }
  }
  @media (max-width: 768px) {
    .client_link:hover svg {
      fill: #28282890
    }
  }
</style>

<template>
  <div>
    <div>
      <p class="text--small name">{{name}}</p>
      <div v-if="email !== ''" class="client_link__details">
        <inline-svg :src="require('../assets/svg/email.svg')" />
        <p>{{email}}</p>
      </div>
      <div v-if="number !== ''" class="client_link__details">
        <inline-svg :src="require('../assets/svg/mobile.svg')" />
        <p>{{number}}</p>
      </div>
    </div>
    <p v-if="(notes === null || notes === '<p><br></p>' || notes === '') && !archive" class="grey">What client information do you currently have? Head over to this page and edit it.</p>
    <div v-if="notes !== null && notes !== '<p><br></p>' && notes !== '' && !archive" v-html="notes" class="client_link__notes__content" />
    <div v-if="archive" class="client_link__options">
      <a href="javascript:void(0)" @click="$parent.$parent.client_unarchive(clientId, clientIndex)" title="Unarchive">
        <inline-svg :src="require('../assets/svg/archive-small.svg')" class="archive__icon" aria-label="Unarchive"/>
      </a>
      <a href="javascript:void(0)" @click="$parent.$parent.client_delete(clientId, clientIndex)" title="Delete">
        <inline-svg :src="require('../assets/svg/bin.svg')" class="archive__icon" aria-label="Delete"/>
      </a>
    </div>
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg
    },
    props: ['name', 'email', 'number', 'notes', 'archive', 'clientId', 'clientIndex']
  }
</script>