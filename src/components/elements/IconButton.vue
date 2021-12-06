<style lang="scss" scoped>
.icon_button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition_standard);
  &:hover {
    opacity: 0.6;
  }
}
</style>

<template>
  <div
    class="icon_button"
    @click="
      () => {
        if (onClick) onClick();
      }
    "
  >
    <inline-svg
      :class="svgClass"
      :style="{ height: `${iconSize}px`, width: `${iconSize}px` }"
      :src="require(`@/assets/svg/${svg}.svg`)"
    />
  </div>
</template>

<script>
export default {
  props: {
    svg: String,
    svgClass: String,
    iconSize: Number,
    onClick: Function,
  },
};
</script>
