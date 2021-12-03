<style lang="scss" scoped>
.text {
  white-space: nowrap;
  user-select: none;
  color: var(--base);
  text-decoration: none;
  position: relative;
  border: 0;
  opacity: 0;
  height: fit-content;
  height: -moz-fit-content;
  margin: auto 0;
  transition: var(--transition_standard);
}
.icon {
  margin: 0 0.4rem 0 0;
  vertical-align: bottom;
  padding: 0.2rem;
  border-radius: 5px;
  height: 1.8rem;
  width: 1.8rem;
  transition: var(--transition_standard);
}
</style>

<template>
  <router-link v-if="internal" :to="link" :title="name">
    <inline-svg
      :src="require(`../../../../assets/svg/${svg}.svg`)"
      class="icon fadeIn"
      :aria-label="name"
    />
    <p class="text">
      {{ name }}
    </p>
  </router-link>
  <a v-else :href="link" :title="name">
    <inline-svg
      :src="require(`../../../../assets/svg/${svg}.svg`)"
      class="icon fadeIn"
      :aria-label="name"
    />
    <p class="text">
      {{ name }}
    </p>
  </a>
</template>

<script>
export default {
  props: {
    internal: Boolean,
    link: String,
    name: String,
    svg: String,
  },
};
</script>
