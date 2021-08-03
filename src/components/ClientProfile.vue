<style lang="scss" scoped>
.profile_container {
  .profile_image {
    text-align: center
  }
  img {
    height: 140px;
    width: 140px;
    border-radius: 50%;
    filter: grayscale(.8)
  }
  .img_icon {
    padding: 1.8rem;
    height: 140px;
    width: 140px;
    border: 4px solid var(--base);
    border-radius: 50%
  }
  .client_user_details {
    display: grid;
    grid-gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
    > input {
      margin: auto
    }
    .input_skeleton {
      width: 300px;
      margin: auto
    }
  }

  // -----------------------------
  // Bookings
  // -----------------------------

  /* Booking skeleton */
  .bookings_container_skeleton {
    margin: 2rem 0
  }

  /* Booking outer container */
  .bookings_container {
    padding: 2rem;
    background-color: var(--fore);
    border: 3px solid var(--base);
    border-radius: 10px;
    margin: 2rem 0;

    /* Booking inner container */
    .bookings_sub_container {
      display: grid;
      grid-template-columns: 1fr .9fr;
      grid-gap: 1.6rem;
      margin-top: 1rem;

      /* Container for creating bookings */
      .request_booking_container {
        display: flex;
        flex-direction: column;
        *:not(:last-child) {
          margin-bottom: 1rem
        }
      }

      /* Container for booking events */
      .bookings_wrapper {
        &::-webkit-scrollbar {
          width: 6px
        }
      }
    }
  }
}

/* Booking event */
.booking {
  display: grid;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--base_faint);
  padding-bottom: 1rem;
  height: fit-content;
  &.past {
    opacity: var(--light_opacity)
  }
  .details {
    display: grid;
    grid-gap: .6rem
  }
  .status {
    display: flex;
    justify-content: space-between;
    > p:first-child {
      font-weight: bold
    }
    > a {
      color: var(--base_red)
    }
  }
}

@media (max-width: 576px) {
  .profile_container {
    .bookings_container {
      .bookings_sub_container {
        display: block;
        .request_booking_container {
          margin-top: 2rem
        }
      }
    }
  }
}
</style>

<template>
  <div>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <input-pop-up ref="input_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <global-overlay ref="overlay" />
    </transition>
    <div class="profile_container">
      <inline-svg
        class="close_icon cursor"
        :src="require('../assets/svg/close.svg')"
        aria-label="Close"
        @click="$parent.isProfileOpen = false, willBodyScroll(true)"
      />
      <skeleton v-if="loading" :type="'profile_image'" />
      <div v-else class="profile_image">
        <img
          v-if="clientUser.profile_image"
          :src="clientUser.profile_image"
          class="cursor"
          alt="Profile img"
          @click="$refs.input_pop_up.show('image', 'Select your image to upload', 'Make sure that it\'s less than 1MB')"
        >
        <inline-svg
          v-else
          :src="require('../assets/svg/profile-image.svg')"
          class="img_icon cursor"
          @click="$refs.input_pop_up.show('image', 'Select your image to upload', 'Make sure that it\'s less than 1MB')"
        />
      </div>
      <div class="client_user_details">
        <skeleton
          v-if="loading"
          :type="'input_small'"
          class="input_skeleton"
        />
        <input
          v-else
          v-model="clientUser.name"
          :disabled="silentLoading"
          class="small_border_radius width_300"
          type="name"
          inputmode="name"
          autocomplete="name"
          placeholder="Name"
          aria-label="Name"
          @blur="updateClientDetails()"
        >
        <skeleton
          v-if="loading"
          :type="'input_small'"
          class="input_skeleton"
        />
        <input
          v-else
          v-model="clientUser.number"
          :disabled="silentLoading"
          class="small_border_radius width_300"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="Mobile"
          aria-label="Mobile"
          pattern="\d+"
          @blur="updateClientDetails()"
        >
      </div>
      <skeleton
        v-if="loading"
        :type="'client'"
        class="bookings_container_skeleton"
      />
      <div v-else class="bookings_container">
        <h3>Upcoming</h3>
        <div class="bookings_sub_container">
          <div v-if="clientUser.bookings.length !== 0" class="bookings_wrapper">
            <div
              v-for="(booking, bookingIndex) in clientUser.bookings"
              :key="`bookings_${bookingIndex}`"
              :class="{ past: isInThePast(booking) }"
              class="booking fadeIn"
            >
              <div class="details">
                <p>
                  <b>
                    {{ day(booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]).toUpperCase() }} {{ booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }} at {{ shortTime(booking.datetime) }}
                  </b>
                </p>
                <p>
                  {{ booking.notes }}
                </p>
              </div>
              <div
                v-if="!isInThePast(booking) || booking.status !== 'Scheduled'"
                class="status"
              >
                <p :style="{ color: statusColor(isInThePast(booking) ? 'Past' : booking.status) }">
                  {{ isInThePast(booking) ? 'Past' : booking.status }}
                </p>
                <a
                  v-if="!isInThePast(booking)"
                  href="javascript:void(0)"
                  class="a_link"
                  @click="cancelBooking(booking.id, booking.datetime)"
                >
                  Cancel
                </a>
              </div>
            </div>
          </div>
          <p v-else class="grey">
            No bookings yet
          </p>
          <form class="request_booking_container" @submit.prevent="createBooking()">
            <input
              v-model="bookingForm.date"
              :min="today()"
              class="small_border_radius"
              type="date"
              placeholder="Date"
              aria-label="Date"
              required
              @input="checkForm()"
            >
            <input
              v-model="bookingForm.time"
              :min="bookingForm.date === (today()) ? timeNow() : null"
              class="small_border_radius"
              type="time"
              placeholder="Time"
              aria-label="Time"
              required
              @input="checkForm()"
            >
            <textarea
              v-model="bookingForm.notes"
              class="additional_notes small_border_radius"
              rows="5"
              placeholder="Additonal information"
              aria-label="Additional information"
              required
              @input="checkForm()"
            />
            <button :disabled="disableCreateBookingButton">
              Request a booking
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      bookingForm: {
        date: this.today(),
        time: this.timeNow(),
        notes: null
      },
      disableCreateBookingButton: true
    }
  },
  computed: mapState([
    'loading',
    'silentLoading',
    'claims',
    'clientUser'
  ]),
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    checkForm () {
      this.disableCreateBookingButton = !(this.bookingForm.date && this.bookingForm.time && this.bookingForm.notes)
    },
    /**
     * Adds a user profile image.
     */
    addImg () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        const FILE = document.getElementById('img_uploader').files[0]
        const READER = new FileReader()
        const self = this
        READER.addEventListener('load', () => {
          this.$axios.post('/.netlify/functions/upload', { file: READER.result.toString() }).then((response) => {
            self.$store.dispatch('updateClientSideDetails', {
              id: this.claims.client_id_db,
              name: this.clientUser.name,
              number: this.clientUser.number,
              profile_image: response.data.url
            })
          })
        }, false)
        if (FILE) {
          if (FILE.size < 1100000) {
            // eslint-disable-next-line
            new Compressor(FILE, {
              quality: 0.6,
              success (result) {
                READER.readAsDataURL(result)
              },
              error (err) {
                console.error(err.message)
              }
            })
          } else {
            this.$parent.$parent.$refs.response_pop_up.show('File size is too big', 'Please compress it to 1MB or lower', true, true)
            document.getElementById('img_uploader').value = ''
          }
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },

    /**
     * Updates the client details.
     */
    updateClientDetails () {
      try {
        this.$store.commit('setData', {
          attr: 'silentLoading',
          data: true
        })
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        this.$store.dispatch('updateClientSideDetails', {
          id: this.claims.client_id_db,
          name: this.clientUser.name,
          number: this.clientUser.number,
          profile_image: this.clientUser.profile_image
        })
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },

    // -----------------------------
    // Database
    // -----------------------------

    /**
     * Opens a new booking request.
     */
    async createBooking () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('createBooking', {
          clientId: this.claims.client_id_db,
          datetime: this.bookingForm.date + ' ' + this.bookingForm.time,
          notes: this.bookingForm.notes,
          status: 'Pending',
          isTrainer: false
        })
        this.bookingForm = {
          date: this.today(),
          time: this.timeNow(),
          notes: null
        }
        this.$parent.$parent.$refs.response_pop_up.show('Booking requested', 'Your trainer will be notified')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },

    /**
     * Cancels a booking.
     * @param {integer} bookingId - The id of the booking.
     * @param {datetime} datetime - The id of the booking.
     */
    async cancelBooking (bookingId, datetime) {
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure you want to cancel this booking?', 'We will not be able to recover this information.')) {
        try {
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          await this.$store.dispatch('deleteBooking', {
            clientId: this.claims.client_id_db,
            bookingId,
            datetime,
            isTrainer: false
          })
          this.$parent.$parent.$refs.response_pop_up.show('Booking cancelled', 'Your trainer will be notified')
          this.$store.dispatch('endLoading')
        } catch (e) {
          this.$parent.$parent.resolveError(e)
        }
      }
    }
  }
}
</script>
