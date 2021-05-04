<style scoped>
img {
  width: 100%;
  border-radius: 10px;
  margin: 1rem 0
}
.update_wrapper {
  display: grid;
  grid-gap: 4rem
}
.update_item {
  background-color: var(--fore);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--low_shadow)
}

/* Responsive */
@media (max-width: 576px) {
  button {
    width: 100%
  }
  .update_item {
    padding: .8rem
  }
}
</style>

<template>
  <div class="bottom_margin">
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
    <br>
    <button class="red_button" @click="$parent.isWhatsNewOpen = false, willBodyScroll(true), updateVersion()">
      Close
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      content: [
        { title: 'Editor improvements', desc: 'We\'ve added more to our editor! You can now insert templates directly into the text and add in dividers to organise your plans and sessions.', img: 'new-style.png' },
        { title: 'More statistics', desc: 'Through re-designing our statistics feature, you can now enjoy better error reporting with tracked data — meaning that if there\'s a mistake with the tracking format, then you\'ll be able to find it easier.', img: 'stats.png' },
        { title: 'Scatter graph', desc: 'Here\'s a way to analyse your clients\' performance. With the scatter graph, you\'ll be able to see the distribution of their sessions and the overall trend.', img: 'scatter.png' },
        { title: 'Better multiselect', desc: 'Big, bold, and animated. There\'s something really satisfying about these icons. We\'ve placed more emphasis on making the mobile experience more seamless.', img: 'multi.png' },
        { title: 'Prediction', desc: 'You can now look into a crystal ball and see into the future... not quite. Through doing a regression on the data you have tracked, we can estimate what the future value is depending on the day since the start of that plan.', img: 'prediction.png' },
        { title: 'More tracking options', desc: ' Add tracked data sections into your sessions. This way, you can easily see which exercises are tracked and which aren\'t. Follow the same tracking format but without the square brackets. You can still use our square brackets method if your want to build more complex exercises.', img: 'protocol.png' }
      ]
    }
  },
  computed: mapState([
    'versionName',
    'versionBuild'
  ]),
  methods: {
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
