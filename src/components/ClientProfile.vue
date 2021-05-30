<style scoped>
.close_icon {
  float: right
}
.profile_image {
  text-align: center
}
.profile_container img {
  height: 140px;
  width: 140px;
  border-radius: 50%;
  filter: grayscale(.8)
}
.profile_container .img_icon {
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
  margin-bottom: 4rem
}
.input_skeleton {
  width: 300px
}
.client_user_details > input,
.input_skeleton {
  margin: auto
}

/* Bookings */
.bookings_container_skeleton {
  margin: 2rem 0
}
.bookings_container {
  padding: 1rem;
  background-color: var(--fore);
  border: 3px solid var(--base);
  border-radius: 10px;
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
          @click="$refs.input_pop_up.show('image', 'Select your image to upload', 'Make sure that it\'s less than 400kb')"
        >
        <inline-svg
          v-else
          :src="require('../assets/svg/profile-image.svg')"
          class="img_icon cursor"
          @click="$refs.input_pop_up.show('image', 'Select your image to upload', 'Make sure that it\'s less than 400kb')"
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
              class="booking_event"
            >
              <p>{{ booking.date }}</p>
              <p>{{ booking.notes }}</p>
            </div>
          </div>
          <p v-else class="grey">
            No bookings yet, your clients will be able to request a time and date
          </p>
          <form class="request_booking_container" @submit.prevent="bookSession()">
            <p><b>Make a request</b></p>
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
            <textarea
              v-model="booking_form.notes"
              class="additional_notes small_border_radius"
              rows="5"
              placeholder="Additonal information"
              aria-label="Additional information"
              required
            />
            <button>Submit</button>
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
      booking_form: {
        date: null,
        time: null,
        notes: null
      }
    }
  },
  computed: mapState([
    'loading',
    'silentLoading',
    'claims',
    'clientUser',
    'bookings'
  ]),
  methods: {
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
          if (FILE.size < 450000) {
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
            this.$parent.$parent.$refs.response_pop_up.show('File size is too big', 'Please compress it to 400kb or lower', true, true)
            document.getElementById('img_uploader').value = ''
          }
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },
    updateClientDetails () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        this.$store.commit('setData', {
          attr: 'silentLoading',
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

    // Bookings

    async createBooking () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('createBooking', {
          client_id: this.claims.client_id_db,
          date: this.booking_form.date,
          time: this.booking_form.time,
          notes: this.booking_form.notes,
          status: 'Pending'
        })
        this.booking_form = {
          date: null,
          time: null,
          notes: null
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },
    async cancelBooking (bookingId) {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('createBooking', {
          clientId: this.claims.client_id_db,
          bookingId
        })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    }
  }
}
</script>
