<style lang="scss" scoped>
h1,
h2 {
  font-size: 2.6rem;
}
h3,
.large_body {
  font-size: 1.6rem;
}
.body {
  font-size: 1rem;
}
.tiny {
  font-size: 0.8rem;
}
.grey {
  color: var(--base_light);
}
.bold {
  font-weight: bold;
}
</style>

<template>
  <h1 v-if="type === 'title' && isMain" :class="{ grey }">
    <slot />
  </h1>
  <h2 v-else-if="type === 'title'" :class="{ grey }">
    <slot />
  </h2>
  <h3 v-else-if="type === 'subtitle'" :class="{ grey }">
    <slot />
  </h3>
  <p v-else-if="type === 'tiny'" class="tiny" :class="{ grey, bold }">
    <slot />
  </p>
  <p
    v-else-if="type === 'large-body'"
    class="large_body"
    :class="{ grey, bold }"
  >
    <slot />
  </p>
  <p v-else class="body" :class="{ grey, bold }">
    <slot />
  </p>
</template>

<script>
export default {
  props: {
    type: String,
    isMain: Boolean,
    bold: Boolean,
    grey: Boolean,
  },
};
</script>
