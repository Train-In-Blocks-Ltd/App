<style scoped>
  /* SEE HOME.VUE FOR MORE CSS */
  .select_checkbox {
    margin-bottom: .4rem
  }

  /* Client Link */
  .client_link svg {
    width: 20px;
    fill: var(--base);
    transition: var(--transition_standard)
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
    color: var(--base);
    transition: var(--transition_standard)
  }
  .client_link__details img, .client_link__details iframe {
    border-radius: 3px
  }
  .client_link.archived .client_link__details p, .client_link.archived .name {
    color: var(--base)
  }
  .client_link__options {
    display: flex;
    align-items: center
  }

  @media (min-width: 768px) {
    .client_link__options {
      flex-direction: column
    }
  }
  @media (max-width: 768px) {
    .client_link:hover svg {
      fill: var(--base)
    }
    .client_link__options a, .select_checkbox {
      margin: 0 1rem 0 0
    }
  }
</style>

<template>
  <div>
    <div>
      <h2 class="name">
        {{ name }}
      </h2>
      <div v-if="email !== ''" class="client_link__details">
        <inline-svg :src="require('../assets/svg/email.svg')" />
        <p>{{ email }}</p>
      </div>
      <div v-if="number !== ''" class="client_link__details">
        <inline-svg :src="require('../assets/svg/mobile.svg')" />
        <p>{{ number }}</p>
      </div>
    </div>
    <p v-if="(notes === null || notes === '<p><br></p>' || notes === '') && !archive" class="grey">
      What client information do you currently have? Head over to this page and edit it.
    </p>
    <div v-if="notes !== null && notes !== '<p><br></p>' && notes !== '' && !archive" class="client_link__notes__content" v-html="remove_brackets_and_checkbox(notes)" />
    <div v-if="archive" class="client_link__options">
      <checkbox :item-id="clientId" :type="'v2'" class="select_checkbox" aria-label="Select this client" />
      <a href="javascript:void(0)" title="Unarchive" @click="$parent.unarchive_single(clientId)">
        <inline-svg :src="require('../assets/svg/archive.svg')" class="archive_icon" aria-label="Unarchive" />
      </a>
      <a href="javascript:void(0)" title="Delete" @click="soloDelete(clientId)">
        <inline-svg :src="require('../assets/svg/bin.svg')" class="archive_icon" aria-label="Delete" />
      </a>
    </div>
  </div>
</template>

<script>

import Checkbox from './Checkbox'

export default {
  components: {
    Checkbox
  },
  props: ['name', 'email', 'number', 'notes', 'archive', 'clientId', 'clientIndex'],
  methods: {
    soloDelete (id) {
      if (confirm('Are you sure that you want to delete this client?')) {
        this.$parent.$parent.client_delete(id)
      }
    }
  }
}
</script>
