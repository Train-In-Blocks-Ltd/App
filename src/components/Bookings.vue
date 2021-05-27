<style scoped>
/* Bookings */
#bookings {
  margin-bottom: 2rem
}
.bookings_container_skeleton {
  margin: 2rem 0
}
.request_booking_container {
  display: grid;
  grid-gap: 1rem
}
.bookings_sub_container {
  display: grid;
  grid-template-columns: 1fr .8fr;
  grid-gap: 1rem;
  margin-top: 1rem
}
.date_time_wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: .4rem
}

/* Responsive */
@media (max-width: 576px) {
  .bookings_sub_container {
    display: block
  }
  .request_booking_container {
    margin-top: 2rem
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
      <div v-if="bookings.length !== 0" class="bookings_wrapper">
        <div
          v-for="(booking, bookingIndex) in bookings"
          :key="`bookings_${bookingIndex}`"
          class="booking_event"
        >
          <p>{{ booking.date }}</p>
          <p>{{ booking.notes }}</p>
        </div>
      </div>
      <p v-else class="grey">
        No bookings made or confirmed
      </p>
      <form class="request_booking_container" @submit.prevent="bookSession()">
        <p><b>Create a booking</b></p>
        <select
          id="client_booking_select"
          name="client_booking_select"
          aria-label="Select a client"
          required
        >
          <option
            v-for="(client, clientIndex) in clients"
            :key="`client_booking_select_${clientIndex}`"
            :value="client.name"
          >
            {{ client.name }}
          </option>
        </select>
        <div class="date_time_wrapper">
          <input type="date" aria-label="Date" required>
          <input type="time" aria-label="Time" required>
        </div>
        <textarea
          class="additional_notes"
          rows="5"
          placeholder="Additonal information"
          aria-label="Additional information"
          required
        />
        <button>Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'clients',
    'bookings'
  ])
}
</script>
