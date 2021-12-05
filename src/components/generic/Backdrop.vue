<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: calc(100vh - env(safe-area-inset-bottom));
  background-color: #00000080;
  z-index: 90;
}
</style>

<template>
  <div
    class="backdrop"
    @click="
      () => {
        if (onClick) onClick();
      }
    "
  />
</template>

<script>
export default {
  props: {
    onClick: Function,
  },
};
</script>
