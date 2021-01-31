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
    transition: .6s all cubic-bezier(.165, .84, .44, 1)
  }
  .color:hover {
    opacity: .6
  }
</style>

<template>
  <div id="color_picker">
    <div
      v-for="(paint, index) in colorPalette"
      :key="'color_' + index"
      :style="{ backgroundColor: paint.color }"
      @click="selectedColor = paint.color"
      class="color"
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