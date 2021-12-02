<style lang="scss" scoped>
.title,
.subtitle {
  font-size: 2.6rem;
}
.large_body {
  font-size: 1.6rem;
  font-weight: bold;
}
.body {
  font-size: 1rem;
}
.tiny {
  font-size: 0.8rem;
}
</style>

<template>
  <div>
    <h1 class="title" v-if="type === 'title'">
      <slot />
    </h1>
    <h2 class="subtitle" v-else-if="type === 'subtitle'">
      <slot />
    </h2>
    <h3 class="large_body" v-else-if="type === 'large-body'">
      <slot />
    </h3>
    <p class="tiny" v-else-if="type === 'tiny'">
      <slot />
    </p>
    <p class="body" v-else>
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
  },
};
</script>
