<style lang="scss" scoped>
.icon_button {
  cursor: pointer;
  transition: var(--transition_standard);
  &:hover {
    opacity: 0.6;
  }
  svg {
    height: 24px;
    width: 24px;
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
    <inline-svg :src="require(`@/assets/svg/${svg}.svg`)" />
  </div>
</template>

<script>
export default {
  props: {
    svg: String,
    onClick: Function,
  },
};
</script>
