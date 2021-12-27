<style lang="scss" scoped>
.week-button {
  display: grid;
  grid-template-rows: 8px 64px;
  user-select: none;
  cursor: pointer;
  width: 100%;
  border: 2px solid var(--base_faint);
  border-radius: 5px;
  transition: var(--transition_standard);
  &:hover {
    opacity: var(--light_opacity);
  }
  &.active {
    border-color: var(--base);
    background-color: var(--fore);
    &:hover {
      opacity: var(--light_opacity);
    }
  }
  .color {
    width: 100%;
    height: 100%;
    border-radius: 3px 3px 0 0;
  }
  .number {
    margin: auto;
  }
}
</style>

<template>
  <div class="week-button" @click="changeWeek">
    <div
      :style="{
        backgroundColor: weekColor,
      }"
      class="color"
    />
    <div class="number">
      {{ number }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    weekColor: String,
    number: [String, Number],
  },
  computed: mapState(["currentWeek"]),
  methods: {
    /**
     * Switch to a different week.
     */
    changeWeek() {
      this.$store.dispatch("changeWeek", parseInt(this.number));
    },
  },
};
</script>
