<style lang="scss">
/* Preview HTML */
.preview_html {
  font-size: 0.8rem;
  margin-top: 0.4rem;
  * {
    color: var(--base);
    transition: var(--transition_standard);
  }
  p {
    margin: 0.4rem 0;
  }
  img,
  iframe,
  a,
  > div > br:only-child {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
/* Client Link */
.container {
  display: grid;
  padding: 2rem;
  grid-gap: 1rem;
  color: var(--base);
  text-decoration: none;
  border: 3px solid var(--base);
  border-radius: 10px;
  transition: var(--transition_standard);
  &:hover {
    box-shadow: var(--high_shadow);
  }
  &.archived {
    display: flex;
    justify-content: space-between;
    .name {
      color: var(--base);
    }
  }

  /* Client info top section */
  .client_information {
    display: grid;
    grid-template-columns: 0.1fr 1fr;
    grid-gap: 1rem;
    > div:first-child {
      display: flex;
      justify-content: space-between;
    }
    .image {
      background-size: cover;
      background-position: center;
      height: 80px;
      width: 80px;
      filter: grayscale(0.8);
      border-radius: 50%;
    }
    .profile_image_placeholder {
      padding: 0.8rem;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      border: 3px solid var(--base);
    }
    .today-tag {
      float: right;
      height: fit-content;
      height: -moz-fit-content;
      width: fit-content;
      width: -moz-fit-content;
      padding: 0.2rem 1rem;
      border-radius: 3px;
      color: var(--fore);
      font-weight: bold;
      background: var(--base_green);
      &.small-screen {
        display: none;
      }
    }

    /* Client link details */
    .client_link__details {
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-gap: 1rem;
      p,
      .name {
        margin: auto 0;
        color: var(--base);
        transition: var(--transition_standard);
      }
      svg {
        width: 20px;
        fill: var(--base);
        transition: var(--transition_standard);
      }
    }
  }

  /* Selection */
  .select_checkbox {
    margin-bottom: 0.4rem;
  }
}

@media (max-width: 768px) {
  .client_link {
    &:hover {
      box-shadow: var(--low_shadow);
      svg {
        fill: var(--base);
      }
    }
    &:active {
      transform: var(--active_state);
    }
    .client_information {
      grid-template-columns: 1fr;
      .profile_image_placeholder,
      img {
        margin: auto auto auto 0;
      }
      .today-tag {
        display: none;
        &.small-screen {
          display: block;
        }
      }
    }
  }
}
@media (max-width: 576px) {
  .client_link {
    padding: 0.8rem;
  }
}
</style>

<template>
  <card-wrapper class="container">
    <div class="client_information">
      <div>
        <div
          v-if="client.profile_image"
          :style="{ backgroundImage: `url(${client.profile_image})` }"
          class="image"
        />
        <inline-svg
          v-else
          class="profile_image_placeholder"
          :src="require('../assets/svg/profile-image.svg')"
        />
        <p v-if="nextBooking.isToday" class="today-tag small-screen text--tiny">
          Today
        </p>
      </div>
      <div>
        <p v-if="nextBooking.isToday" class="today-tag text--tiny">Today</p>
        <h3 class="name">
          {{ client.name }}
        </h3>
        <div v-if="client.email" class="client_link__details">
          <inline-svg :src="require('../assets/svg/email.svg')" />
          <p>
            {{ client.email }}
          </p>
        </div>
        <div v-if="client.number" class="client_link__details">
          <inline-svg :src="require('../assets/svg/mobile.svg')" />
          <p>
            {{ client.number }}
          </p>
        </div>
      </div>
    </div>
    <p v-if="nextBooking.datetime">
      <b>Next booking:</b>
      {{
        day(nextBooking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]).toUpperCase()
      }}
      {{ nextBooking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }} at
      {{ shortTime(nextBooking.datetime) }}
    </p>
    <p
      v-if="
        (client.notes === null ||
          client.notes === '<p><br></p>' ||
          client.notes === '') &&
        !archive
      "
      class="grey"
    >
      What client information do you currently have? Head over to this page and
      edit it.
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
  </card-wrapper>
</template>

<script>
import { mapState } from "vuex";
const CardWrapper = () =>
  import(
    /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "./generic/CardWrapper"
  );
const Checkbox = () =>
  import(
    /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "./Checkbox"
  );

export default {
  components: {
    CardWrapper,
    Checkbox,
  },
  props: {
    client: Object,
    clientIndex: Number,
    archive: Boolean,
  },
  data() {
    return {
      nextBooking: {
        datetime: false,
        isToday: false,
      },
    };
  },
  computed: mapState(["bookings"]),
  created() {
    const NEXT_BOOKING =
      this.bookings.filter(
        (booking) =>
          booking.client_id === this.client.client_id &&
          new Date(booking.datetime) > new Date()
      )[0] || false;
    if (NEXT_BOOKING) {
      const DATE_AND_TIME = NEXT_BOOKING.datetime.split(" ");
      this.nextBooking.datetime = `${
        DATE_AND_TIME[0] === this.today() ? "Today" : DATE_AND_TIME[0]
      } ${DATE_AND_TIME[1]}`;
      this.nextBooking.isToday = DATE_AND_TIME[0] === this.today();
    }
  },
};
</script>
