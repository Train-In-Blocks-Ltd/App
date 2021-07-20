<style lang="scss" scoped>
.close_icon {
  float: right
}
.update_wrapper {
  display: grid;
  grid-gap: 4rem;
  .update_item {
    background-color: var(--fore);
    border: 3px solid var(--base);
    border-radius: 10px;
    padding: 2rem;
    img {
      width: 100%;
      border-radius: 10px;
      margin: 1rem 0
    }
  }
}

@media (max-width: 576px) {
  .update_item {
    padding: .8rem
  }
}
</style>

<template>
  <div class="bottom_margin">
    <inline-svg
      class="close_icon cursor"
      :src="require('../assets/svg/close.svg')"
      aria-label="Close"
      @click="$parent.isWhatsNewOpen = false, willBodyScroll(true), updateVersion()"
    />
    <h2>
      {{ versionName }} {{ versionBuild }}
    </h2>
    <p class="text--small grey">
      Buffed editor, style, statistics, and predictions
    </p>
    <br><br>
    <div class="update_wrapper">
      <div
        v-for="(item, index) in content"
        :key="`item_${index}`"
        class="update_item"
      >
        <img
          v-if="item.img"
          :src="require(`../assets/whats-new/${item.img}`)"
          :alt="item.title"
          loading="lazy"
        >
        <h3>
          {{ item.title }}
        </h3>
        <p class="grey">
          {{ item.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      content: [
        { title: 'Stripe payments', desc: '', img: '' },
        { title: 'Bookings', desc: '', img: '' },
        { title: 'Client profile picture', desc: '', img: '' },
        { title: 'Calendar links', desc: '', img: '' },
        { title: 'Updated UI', desc: '', img: '' },
        { title: 'Offline support', desc: '', img: '' },
        { title: 'Faster and smaller', desc: '', img: '' }
      ]
    }
  },
  computed: mapState([
    'versionName',
    'versionBuild'
  ]),
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Updates the version stored in local storage.
     */
    updateVersion () {
      localStorage.setItem('versionBuild', this.versionBuild)
      this.$store.commit('setData', {
        attr: 'newBuild',
        data: false
      })
    }
  }
}
</script>
