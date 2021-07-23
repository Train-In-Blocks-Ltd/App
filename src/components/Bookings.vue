<style lang="scss" scoped>

/* Bookings */
#bookings {
  margin-bottom: 2rem;
  .all_bookings {
    .close_icon {
      float: right
    }
    .container {
      margin-top: 2rem
    }
  }
  .bookings_container_skeleton {
    margin: 2rem 0
  }
  .request_booking_container {
    display: flex;
    flex-direction: column;
    > *:not(:last-child) {
      margin-bottom: 1rem
    }
    .date_time_wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: .4rem
    }
  }
  .bookings_sub_container {
    display: grid;
    grid-template-columns: 1fr .9fr;
    grid-gap: 1.6rem;
    margin-top: 1rem;
    .bookings_wrapper::-webkit-scrollbar {
      width: 6px
    }
  }
}

/* Booking event */
.booking {
  display: grid;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--base_faint);
  height: fit-content;
  &.request > div:first-child:before {
    content: 'New request';
    display: flex;
    height: fit-content;
    width: fit-content;
    padding: .2rem .6rem;
    margin-left: auto;
    background-color: var(--base);
    color: var(--fore);
    font-size: .8rem;
    border-radius: 3px;
    float: right
  }
  .details > p:first-child {
    margin: 0
  }
  .status {
    display: flex;
    justify-content: space-between;
    > .options {
      display: flex;
      > .accept {
        color: var(--base_green);
        margin-right: 1rem
      }
      > .reject {
        color: var(--base_red)
      }
    }
  }
  .accept_request {
    color: green
  }
}

/* Responsive */
@media (max-width: 768px) {
  #bookings .bookings_sub_container {
    display: block;
    .request_booking_container {
      margin-top: 2rem
    }
  }
}
</style>

<template>
  <div id="bookings">
    <div :class="{ opened_sections: showAllBookings }" class="section_overlay" />
    <div
      v-if="showAllBookings"
      class="all_bookings tab_overlay_content fadeIn delay fill_mode_both small_border_radius"
    >
      <inline-svg
        class="close_icon cursor"
        :src="require('../assets/svg/close.svg')"
        aria-label="Close"
        @click="showAllBookings = false, willBodyScroll(true)"
      />
      <h2>
        All bookings
      </h2>
      <div class="container">
        <div
          v-for="(booking, bookingIndex) in bookings"
          :key="`all_bookings_${bookingIndex}`"
          :class="{ request: booking.status === 'Pending' }"
          class="booking fadeIn"
        >
          <div class="details">
            <p>
              <b>
                {{ day(booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]).toUpperCase() }} {{ booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }} at {{ shortTime(booking.datetime) }} with {{ clients.find(client => client.client_id === booking.client_id).name }}
              </b>
            </p>
            <p>
              {{ booking.notes }}
            </p>
          </div>
          <div class="status">
            <p :style="{ color: statusColor(booking.status), fontWeight: booking.status === 'Scheduled' ? 'bold' : 'normal' }">
              {{ booking.status }}
            </p>
            <div class="options">
              <a
                v-if="booking.status === 'Pending'"
                href="javascript:void(0)"
                aria-label="Accept booking"
                class="a_link accept"
                @click="acceptBookingRequest(booking.id)"
              >
                Accept
              </a>
              <a
                href="javascript:void(0)"
                class="a_link reject"
                @click="cancelBooking(booking.id, booking.client_id)"
              >
                {{ booking.status === "Pending" ? 'Reject' : (isInThePast(booking) ? 'Delete' : 'Cancel') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2>Upcoming</h2>
    <skeleton
      v-if="loading"
      :type="'bookings'"
      class="bookings_container_skeleton"
    />
    <div v-else class="bookings_sub_container">
      <div v-if="checkForBookings()" class="bookings_wrapper">
        <div
          v-for="(booking, bookingIndex) in futureBookings(bookings).slice(0, 3)"
          :key="`bookings_${bookingIndex}`"
          :class="{ request: booking.status === 'Pending' }"
          class="booking fadeIn"
        >
          <div class="details">
            <p>
              <b>
                {{ day(booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]).toUpperCase() }} {{ booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }} at {{ shortTime(booking.datetime) }} with {{ clients.find(client => client.client_id === booking.client_id).name }}
              </b>
            </p>
            <p>
              {{ booking.notes }}
            </p>
          </div>
          <div class="status">
            <p :style="{ color: statusColor(booking.status), fontWeight: booking.status === 'Scheduled' ? 'bold' : 'normal' }">
              {{ booking.status }}
            </p>
            <div class="options">
              <a
                v-if="booking.status === 'Pending'"
                href="javascript:void(0)"
                aria-label="Accept booking"
                class="a_link accept"
                @click="acceptBookingRequest(booking.id)"
              >
                Accept
              </a>
              <a
                href="javascript:void(0)"
                class="a_link reject"
                @click="cancelBooking(booking.id, booking.client_id)"
              >
                {{ booking.status === "Pending" ? 'Reject' : (isInThePast(booking) ? 'Delete' : 'Cancel') }}
              </a>
            </div>
          </div>
        </div>
        <a
          href="javascript:void(0)"
          class="a_link cursor"
          @click="showAllBookings = true, willBodyScroll(false)"
        >
          <b>
            View all bookings
          </b>
        </a>
      </div>
      <p v-else class="grey">
        No bookings made or confirmed
      </p>
      <form class="request_booking_container" @submit.prevent="createBooking()">
        <select
          v-model="booking_form.clientId"
          class="small_border_radius"
          name="client_booking_select"
          aria-placeholder="Select a client"
          aria-label="Select a client"
          required
        >
          <option
            value="Select a client"
            disabled
            selected
          >
            Select a client
          </option>
          <option
            v-for="(client, clientIndex) in clients"
            :key="`client_booking_select_${clientIndex}`"
            :value="client.client_id"
          >
            {{ client.name }}
          </option>
        </select>
        <div class="date_time_wrapper">
          <input
            v-model="booking_form.date"
            class="small_border_radius"
            type="date"
            placeholder="Date"
            aria-label="Date"
            required
          >
          <input
            v-model="booking_form.time"
            class="small_border_radius"
            type="time"
            placeholder="Time"
            aria-label="Time"
            required
          >
        </div>
        <textarea
          v-model="booking_form.notes"
          class="additional_notes small_border_radius"
          rows="5"
          placeholder="Additonal information"
          aria-label="Additional information"
          required
        />
        <button>
          Create booking
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {

      // Bookings

      booking_form: {
        clientId: 'Select a client',
        date: this.today(),
        time: this.timeNow(),
        notes: null
      },

      // System

      showAllBookings: false
    }
  },
  computed: mapState([
    'clients',
    'bookings',
    'loading'
  ]),
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Checks for bookings.
     */
    checkForBookings () {
      const BOOKINGS = this.bookings || false
      return BOOKINGS ? this.bookings.length !== 0 : false
    },

    /**
     * Checks if the bookings have future bookings.
     * @param {array} bookings - The bookings.
     * @returns Future bookings.
     */
    futureBookings (bookings) {
      return bookings.filter(booking => new Date(booking.datetime) > new Date())
    },

    // -----------------------------
    // Database
    // -----------------------------

    /**
     * Creates a new booking.
     */
    async createBooking () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('createBooking', {
          client_id: this.booking_form.clientId,
          datetime: this.booking_form.date + ' ' + this.booking_form.time,
          notes: this.booking_form.notes,
          status: 'Scheduled',
          isTrainer: true
        })
        this.booking_form = {
          clientId: 'Select a client',
          date: this.today(),
          time: this.timeNow(),
          notes: null
        }
        this.$parent.$parent.$refs.response_pop_up.show('Booking created', 'Your client will be notified')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },

    /**
     * Accepts a booking request made by the client-user.
     * @param {integer} id - The id of the booking.
     */
    async acceptBookingRequest (id) {
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure you want to accept this booking?', 'It will appear as scheduled on your client\'s profile.')) {
        try {
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          await this.$store.dispatch('updateBooking', {
            id,
            status: 'Scheduled'
          })
          this.$parent.$parent.$refs.response_pop_up.show('Booking request accepted', 'Your client will be notified')
          this.$store.dispatch('endLoading')
        } catch (e) {
          this.$parent.$parent.resolveError(e)
        }
      }
    },

    /**
     * Cancels a booking.
     * @param {integer} bookingId - The id of the booking.
     * @param {integer} clientId - The id of the client.
     */
    async cancelBooking (bookingId, clientId) {
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure you want to cancel this booking?', 'We will not be able to recover this information.')) {
        try {
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          await this.$store.dispatch('deleteBooking', {
            clientId,
            bookingId,
            isTrainer: true
          })
          this.$parent.$parent.$refs.response_pop_up.show('Booking cancelled', 'Your client will be notified')
          this.$store.dispatch('endLoading')
        } catch (e) {
          this.$parent.$parent.resolveError(e)
        }
      }
    }
  }
}
</script>
