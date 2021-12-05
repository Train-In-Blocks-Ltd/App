<style lang="scss" scoped>
h1,
h2 {
  font-size: 2.6rem;
}
h3 {
  font-size: 1.6rem;
}
.body {
  font-size: 1rem;
}
.tiny {
  font-size: 0.8rem;
}
</style>

<template>
  <h1 v-if="type === 'title' && isMain">
    <slot />
  </h1>
  <h2 v-else-if="type === 'title'">
    <slot />
  </h2>
  <h3 v-else-if="type === 'subtitle'">
    <slot />
  </h3>
  <p class="tiny" v-else-if="type === 'tiny'">
    <slot />
  </p>
  <p class="body" v-else>
    <slot />
  </p>
</template>

<script>
export default {
  props: {
    type: String,
    isMain: Boolean,
  },
};
</script>
