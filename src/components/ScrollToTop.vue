<style scoped>
  .button--top {
    cursor: pointer;
    position: fixed;
    right: 1rem;
    bottom: 8rem;
    padding: .4rem;
    background-color: #00000010;
    border-radius: 5px;
    z-index: 9999
  }
  .button--top svg {
    transform: rotate(180deg)
  }
</style>

<template>
  <div class="button--top">
    <inline-svg
      v-if="show"
      @click="to_top()"
      :src="require('../assets/svg/arrow.svg')"
    />
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
  props: {
    limit: Number,
    show: Boolean
  },
  methods: {
    to_top () {
      document.getElementById(this.element).scrollTo(0, 0)
    }
  }
}
</script>