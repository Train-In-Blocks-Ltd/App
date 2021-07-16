<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

/* Bookings */
#bookings {
  margin-bottom: 2rem;
  .bookings_container_skeleton {
    margin: 2rem 0
  }
  .request_booking_container {
    display: grid;
    grid-gap: 1rem;
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
    .bookings_wrapper {
      display: grid;
      grid-gap: 1rem;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 1rem;
      box-shadow: inset 0 -10px 10px -10px $inset_shadow, inset 0 10px 10px -10px $inset_shadow
    }
    .bookings_wrapper::-webkit-scrollbar {
      width: 6px
    }
  }
}

/* Booking event */
.booking_event {
  display: grid;
  grid-gap: 2rem;
  border: 3px solid $base;
  height: fit-content;
  padding: 1rem;
  border-radius: 10px;
  .booking_event__details > p:first-child {
    margin: 0
  }
  .booking_event__status {
    display: flex;
    justify-content: space-between;
    > a:last-child {
      color: $base_red
    }
  }
  .booking_event.request > div:first-child:before {
    content: 'New request';
    display: flex;
    height: fit-content;
    width: fit-content;
    padding: .2rem .6rem;
    margin-left: auto;
    background-color: $base;
    color: $fore;
    font-size: .8rem;
    border-radius: 3px;
    transform: translate(.6rem, -.6rem)
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
    <h2>Upcoming</h2>
    <skeleton
      v-if="loading"
      :type="'bookings'"
      class="bookings_container_skeleton"
    />
    <div v-else class="bookings_sub_container">
      <div v-if="checkForBookings()" class="bookings_wrapper">
        <div
          v-for="(booking, bookingIndex) in bookings"
          :key="`bookings_${bookingIndex}`"
          :class="{ request: booking.status === 'Pending' }"
          class="booking_event fadeIn"
        >
          <div class="booking_event__details">
            <p>
              <b>
                {{ day(booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]).toUpperCase() }} {{ booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }} at {{ shortTime(booking.datetime) }} with {{ clients.find(client => client.client_id === booking.client_id).name }}
              </b>
            </p>
            <p>
              {{ booking.notes }}
            </p>
          </div>
          <div class="booking_event__status">
            <p
              v-if="booking.status !== 'Pending'"
              :style="{ color: statusColor(booking.status), fontWeight: booking.status === 'Scheduled' ? 'bold' : 'normal' }"
            >
              {{ booking.status }}
            </p>
            <a
              v-else
              href="javascript:void(0)"
              aria-label="Accept booking"
              class="a_link accept_request"
              @click="acceptBookingRequest(booking.id)"
            >
              Accept
            </a>
            <a
              href="javascript:void(0)"
              class="a_link"
              @click="cancelBooking(booking.id, booking.client_id)"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
      <p v-else class="grey">
        No bookings made or confirmed
      </p>
      <form class="request_booking_container" @submit.prevent="createBooking()">
        <p><b>Create a booking</b></p>
        <select
          v-model="booking_form.clientId"
          class="small_border_radius"
          name="client_booking_select"
          aria-label="Select a client"
          required
        >
          <option
            value="Select a client"
            disabled
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
            aria-label="Date"
            required
          >
          <input
            v-model="booking_form.time"
            class="small_border_radius"
            type="time"
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
          Create
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
        date: null,
        time: null,
        notes: null
      }
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
          date: null,
          time: null,
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
