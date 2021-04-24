<style>
/* Todo List */
.preview_html span.todo-checkbox {
  margin-top: .5rem
}
ul[data-type='todo_list'] {
  padding-left: 0
}
li[data-type='todo_item'] {
  display: flex;
  flex-direction: row
}
.todo-checkbox {
  border: 2px solid var(--base);
  height: .9rem;
  width: .9rem;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: .3rem;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: .2rem;
  background-color: transparent;
  transition: .4s background
}
.todo-content {
  flex: 1
}
.todo-content > p:last-of-type {
  margin-bottom: 0
}
.todo-content > ul[data-type='todo_list'] {
  margin: .5rem 0
}
li[data-done='true'] > .todo-content > p {
  text-decoration: line-through
}
li[data-done='true'] > .todo-checkbox {
  background-color: var(--base)
}
li[data-done='false'] {
  text-decoration: none
}

/* Preview HTML */
.client_link .preview_html {
  font-size: .8rem;
  margin-top: .4rem
}
.client_link .preview_html * {
  color: var(--base);
  transition: var(--transition_standard)
}
.client_link .preview_html p {
  margin: .4rem 0
}
.client_link .preview_html :is(h1, h2) {
  font-size: 1rem
}
.client_link .preview_html :is(img, iframe, a),
.client_link .preview_html > div > br:only-child {
  display: none
}
</style>

<style scoped>

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
.client_link.archived {
  display: flex;
  justify-content: space-between
}
.client_link:hover {
  box-shadow: var(--high_shadow)
}

/* Client info top section */
.client_information {
  display: grid;
  grid-template-columns: .1fr 1fr;
  grid-gap: 1rem
}
.profile_image_placeholder {
  margin: auto;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  border: 3px solid var(--base)
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
.client_link__details svg {
  width: 20px;
  fill: var(--base);
  transition: var(--transition_standard)
}
.client_link.archived .name {
  color: var(--base)
}

@media (max-width: 768px) {
  /* States */
  .client_link:hover svg {
    fill: var(--base)
  }
  .client_link:hover {
    box-shadow: var(--low_shadow)
  }
  .client_link:active {
    transform: var(--active_state)
  }

  /* Image */
  .client_information {
    grid-template-columns: 1fr
  }
  .profile_image_placeholder {
    margin: auto auto auto 0
  }
}
@media (max-width: 576px) {
  .client_link {
    padding: .8rem
  }
}
</style>

<template>
  <div class="client_link">
    <div class="client_information">
      <inline-svg
        class="profile_image_placeholder"
        :src="require('../assets/svg/profile-image.svg')"
      />
      <div>
        <h3 class="name">
          {{ name }}
        </h3>
        <div v-if="email !== ''" class="client_link__details">
          <inline-svg :src="require('../assets/svg/email.svg')" />
          <p>{{ email }}</p>
        </div>
        <div v-if="number !== ''" class="client_link__details">
          <inline-svg :src="require('../assets/svg/mobile.svg')" />
          <p>{{ number }}</p>
        </div>
      </div>
    </div>
    <p v-if="(notes === null || notes === '<p><br></p>' || notes === '') && !archive" class="grey">
      What client information do you currently have? Head over to this page and edit it.
    </p>
    <div
      v-else-if="!archive"
      class="preview_html"
      v-html="update_html(notes, true)"
    />
    <checkbox
      v-if="archive"
      :item-id="clientId"
      :type="'v2'"
      class="select_checkbox"
      aria-label="Select this client"
    />
  </div>
</template>

<script>
import Checkbox from './Checkbox'

export default {
  components: {
    Checkbox
  },
  props: {
    name: String,
    email: String,
    number: String,
    notes: String,
    clientId: Number,
    clientIndex: Number,
    archive: Boolean
  }
}
</script>
