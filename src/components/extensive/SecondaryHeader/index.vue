<style lang="scss" scoped>
.secondary_header .top {
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <div class="secondary_header">
    <div class="top">
      <txt type="subtitle">{{ title }}</txt>
      <slot name="right" />
    </div>
    <slot name="under" />
  </div>
</template>

<script>
const Txt = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "@/components/elements/Txt"
  );

export default {
  props: {
    title: String,
  },
  components: {
    Txt,
  },
};
</script>
