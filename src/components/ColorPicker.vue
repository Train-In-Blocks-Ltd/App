<style scoped>
  #color_picker {
    display: flex
  }
  .color {
    height: 2rem;
    width: 4rem;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 1rem;
    transition: var(--transition_standard)
  }
  .color:hover {
    opacity: var(--light_opacity)
  }

  @media (max-width: 576px) {
    #color_picker {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem
    }
    .color {
      width: 100%
    }
  }
</style>

<template>
  <div id="color_picker" class="fadeIn">
    <div
      v-for="(paint, index) in colorPalette"
      :key="'color_' + index"
      :style="{ backgroundColor: paint.color }"
      class="color"
      @click="selectedColor = paint.color"
    />
  </div>
</template>

<script>
export default {
  props: {
    injectedColor: String
  },
  data () {
    return {
      selectedColor: null,
      colorPalette: [
        { color: '#EB4034' },
        { color: '#EB9634' },
        { color: '#34EB6B' },
        { color: '#346BEB' },
        { color: '#303030' }
      ]
    }
  },
  watch: {
    selectedColor () {
      this.$emit('update:injectedColor', this.selectedColor)
      this.$parent.update_session_color()
    }
  }
}
</script>
