<style lang="scss" scoped>
#color_picker {
  display: flex;
  .color {
    height: 2rem;
    width: 4rem;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 1rem;
    transition: var(--transition_standard);
    &:hover {
      opacity: var(--light_opacity);
    }
  }
}

@media (max-width: 576px) {
  #color_picker {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
    .color {
      width: 100%;
    }
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
      @click="changeWeekColor(paint.color)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      colorPalette: [
        { color: "#EB4034" },
        { color: "#EB9634" },
        { color: "#34EB6B" },
        { color: "#346BEB" },
        { color: "#303030" },
      ],
    };
  },
  computed: mapState(["currentWeek", "weekColor"]),
  methods: {
    changeWeekColor(color) {
      this.$store.dispatch("setPlanColor", color);
      this.$parent.editingWeekColor = false;
    },
  },
};
</script>
