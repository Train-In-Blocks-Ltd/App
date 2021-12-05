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
  <p
    class="tiny"
    :style="{ fontWeight: bold ? 'bold' : 'normal' }"
    v-else-if="type === 'tiny'"
  >
    <slot />
  </p>
  <p v-else class="body" :style="{ fontWeight: bold ? 'bold' : 'normal' }">
    <slot />
  </p>
</template>

<script>
export default {
  props: {
    type: String,
    isMain: Boolean,
    bold: Boolean,
  },
};
</script>
