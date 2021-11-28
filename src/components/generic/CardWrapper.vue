<style lang="scss" scoped>
.container {
  border: 3px solid var(--base);
  border-radius: 10px;
  background: var(--back);
}
</style>

<template>
  <div :class="`container ${cls}`">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    cls: String,
  },
  data() {
    return {
      nextBooking: {
        datetime: false,
        isToday: false,
      },
    };
  },
};
</script>
