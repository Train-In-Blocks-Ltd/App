<style scoped>
  /* Preview HTML */
  .preview_html {
    font-size: .8rem;
    margin-top: .4rem
  }
  .preview_html * {
    color: var(--base);
    transition: var(--transition_standard)
  }
  .preview_html p {
    margin: .4rem 0
  }
  .preview_html h1,
  .preview_html h2 {
    font-size: 1rem
  }
  .preview_html img,
  .preview_html iframe,
  .preview_html a {
    display: none
  }

  /* Other */
  .select_checkbox {
    margin-bottom: .4rem
  }

  /* Client Link */
  .client_link {
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    font-weight: 400;
    color: var(--base);
    text-decoration: none;
    box-shadow: var(--low_shadow);
    background-color: var(--fore);
    border-radius: 10px;
    transition: var(--transition_standard)
  }
  .client_link:hover {
    box-shadow: var(--high_shadow)
  }
  .client_link svg {
    width: 20px;
    fill: var(--base);
    transition: var(--transition_standard)
  }

  /* Client link details */
  .client_link__details {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 1rem
  }
  .client_link__details p,
  .name {
    overflow-wrap: break-word;
    word-wrap: break-word;
    margin: auto 0;
    color: var(--base);
    transition: var(--transition_standard)
  }
  .client_link.archived .name {
    color: var(--base)
  }
  .client_link__options {
    display: flex;
    align-items: center
  }

  @media (min-width: 769px) {
    .client_link__options {
      flex-direction: column
    }
    .client_link.archived {
      display: flex;
      justify-content: space-between
    }
  }
  @media (max-width: 768px) {
    .client_link:hover svg {
      fill: var(--base)
    }
    .client_link__options a,
    .select_checkbox {
      margin: 0 1rem 0 0
    }
    .client_link:hover {
      box-shadow: var(--low_shadow)
    }
    .client_link:active {
      transform: scale(.99)
    }
  }
</style>

<template>
  <div class="client_link">
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
    <div v-if="notes !== null && notes !== '<p><br></p>' && notes !== '' && !archive" class="preview_html" v-html="remove_brackets_and_checkbox(notes)" />
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
    async soloDelete (id) {
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure that you want to delete this client?', 'We will remove their data from our database and it won\'t be recoverable.')) {
        this.$parent.$parent.client_delete(id)
      }
    }
  }
}
</script>
