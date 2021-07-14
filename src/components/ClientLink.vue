<style lang="scss">
@import '../assets/styles/variables.scss';

/* Preview HTML */
.client_link {
  .preview_html {
    font-size: .8rem;
    margin-top: .4rem;
    * {
      color: $base;
      transition: $transition_standard
    }
    p {
      margin: .4rem 0
    }
    :is(img, iframe, a),
    > div > br:only-child {
      display: none
    }
  }
}
</style>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

/* Client Link */
.client_link {
  display: grid;
  padding: 2rem;
  grid-gap: 1rem;
  color: $base;
  text-decoration: none;
  border: 3px solid $base;
  border-radius: 10px;
  transition: $transition_standard;
  &:hover {
    box-shadow: $high_shadow
  }
  &.archived {
    display: flex;
    justify-content: space-between;
    .name {
      color: $base
    }
  }

  /* Client info top section */
  .client_information {
    display: grid;
    grid-template-columns: .1fr 1fr;
    grid-gap: 1rem;
    img {
      height: 80px;
      width: 80px;
      filter: grayscale(.8);
      border-radius: 50%
    }
    .profile_image_placeholder {
      padding: .8rem;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      border: 3px solid $base
    }

    /* Client link details */
    .client_link__details {
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-gap: 1rem;
      p, .name {
        margin: auto 0;
        color: $base;
        transition: $transition_standard
      }
      svg {
        width: 20px;
        fill: $base;
        transition: $transition_standard
      }
    }
  }

  /* Selection */
  .select_checkbox {
    margin-bottom: .4rem
  }
}

@media (max-width: 768px) {
  .client_link {
    &:hover {
      box-shadow: $low_shadow;
      svg {
        fill: $base
      }
    }
    &:active {
      transform: $active_state
    }
    .client_information {
      grid-template-columns: 1fr;
      .profile_image_placeholder,
      img {
        margin: auto auto auto 0
      }
    }
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
      <img v-if="img" :src="img" alt="Profile img">
      <inline-svg
        v-else
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
      v-html="updateHTML(notes, true)"
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
    archive: Boolean,
    img: String
  }
}
</script>
