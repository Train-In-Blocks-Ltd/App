<style lang="scss">

/* Preview HTML */
.client_link {
  .preview_html {
    font-size: .8rem;
    margin-top: .4rem;
    * {
      color: var(--base);
      transition: var(--transition_standard)
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

/* Client Link */
.client_link {
  display: grid;
  padding: 2rem;
  grid-gap: 1rem;
  color: var(--base);
  text-decoration: none;
  border: 3px solid var(--base);
  border-radius: 10px;
  transition: var(--transition_standard);
  &:hover {
    box-shadow: var(--high_shadow)
  }
  &.archived {
    display: flex;
    justify-content: space-between;
    .name {
      color: var(--base)
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
      border: 3px solid var(--base)
    }
    .today-tag {
      float: right;
      width: fit-content;
      padding: .2rem 1rem;
      border-radius: 3px;
      color: var(--fore);
      font-weight: bold;
      background: var(--base_green)
    }

    /* Client link details */
    .client_link__details {
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-gap: 1rem;
      p, .name {
        margin: auto 0;
        color: var(--base);
        transition: var(--transition_standard)
      }
      svg {
        width: 20px;
        fill: var(--base);
        transition: var(--transition_standard)
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
      box-shadow: var(--low_shadow);
      svg {
        fill: var(--base)
      }
    }
    &:active {
      transform: var(--active_state)
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
      <img
        v-if="client.img"
        :src="client.img"
        alt="Profile img"
      >
      <inline-svg
        v-else
        class="profile_image_placeholder"
        :src="require('../assets/svg/profile-image.svg')"
      />
      <div>
        <p
          v-if="nextBooking"
          class="today-tag text--tiny"
        >
          Today
        </p>
        <h3 class="name">
          {{ client.name }}
        </h3>
        <div
          v-if="client.email"
          class="client_link__details"
        >
          <inline-svg :src="require('../assets/svg/email.svg')" />
          <p>
            {{ client.email }}
          </p>
        </div>
        <div
          v-if="client.number"
          class="client_link__details"
        >
          <inline-svg :src="require('../assets/svg/mobile.svg')" />
          <p>
            {{ client.number }}
          </p>
        </div>
      </div>
    </div>
    <p v-if="nextBooking">
      <b>Next booking:</b> {{ nextBooking }}
    </p>
    <p
      v-if="(client.notes === null || client.notes === '<p><br></p>' || client.notes === '') && !archive"
      class="grey"
    >
      What client information do you currently have? Head over to this page and edit it.
    </p>
    <div
      v-else-if="!archive"
      class="preview_html"
      v-html="updateHTML(client.notes, true)"
    />
    <checkbox
      v-if="archive"
      :item-id="client.client_id"
      :type="'v2'"
      class="select_checkbox"
      aria-label="Select this client"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Checkbox from './Checkbox'

export default {
  components: {
    Checkbox
  },
  props: {
    client: Object,
    clientIndex: Number,
    archive: Boolean
  },
  data () {
    return {
      nextBooking: false
    }
  },
  computed: mapState([
    'bookings'
  ]),
  created () {
    const NEXT_BOOKING = this.bookings.filter(booking => booking.client_id === this.client.client_id)[0] || false
    if (NEXT_BOOKING) {
      const DATE_AND_TIME = NEXT_BOOKING.datetime.split(' ')
      this.nextBooking = `${DATE_AND_TIME[0] === this.today() ? 'Today' : DATE_AND_TIME[0]} at ${DATE_AND_TIME[1]}`
    }
  }
}
</script>
