<style scoped>
.profile_container {
  text-align: center
}
.profile_container img {
  height: 140px;
  width: 140px;
  border-radius: 50%;
  filter: grayscale(.8);
  margin: 0 auto
}
.profile_container .img_icon {
  padding: 1.8rem;
  height: 140px;
  width: 140px;
  border: 4px solid var(--base);
  border-radius: 50%;
  margin: 0 auto
}
.profile_container .client_email {
  margin: 2rem 0
}

@media (max-width: 576px) {
  .profile_container button {
    width: 100%
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
      <skeleton
        v-if="loading"
        :type="'input_small'"
        class="client_email"
      />
      <h3 v-else class="client_email">
        {{ claims.email }}
      </h3>
      <button class="red_button" @click="$parent.isProfileOpen = false, willBodyScroll(true)">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'loading',
    'claims',
    'clientUser'
  ]),
  methods: {
    addImg () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        this.$store.commit('setData', {
          attr: 'loading',
          data: true
        })
        const FILE = document.getElementById('img_uploader').files[0]
        const READER = new FileReader()
        const self = this
        READER.addEventListener('load', () => {
          this.$axios.post('/.netlify/functions/upload', { file: READER.result.toString() }).then((response) => {
            self.$store.dispatch('updateProfileImage', response.data.url)
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
        // endLoading occurs at the end of updateProfileImage action to update component
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    }
  }
}
</script>
