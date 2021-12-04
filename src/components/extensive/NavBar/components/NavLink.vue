<style lang="scss">
.link {
  opacity: var(--light_opacity);
  &.router-link-exact-active {
    opacity: 1;
    svg {
      background: var(--base);
      path {
        fill: var(--fore);
      }
    }
  }
  &.router-link-exact-active:hover svg {
    transition: none;
    transform: none;
  }
}
</style>

<style lang="scss" scoped>
.link {
  display: flex;
  height: fit-content;
  height: -moz-fit-content;
  text-decoration: none;
  cursor: pointer;
  margin: 0.6rem auto;
  transition: var(--transition_standard);
  &:hover {
    opacity: 1;
  }
  &.refresh {
    display: none;
  }
  .icon {
    vertical-align: bottom;
    padding: 0.2rem;
    border-radius: 5px;
    height: 1.8rem;
    width: 1.8rem;
    transition: var(--transition_standard);
  }
}

@media (max-width: 768px) {
  .link {
    width: 100%;
    margin: 0;
    padding: 0;
    &.refresh {
      display: flex;
    }
    &.router-link-exact-active {
      background-color: var(--base);
      border-radius: 10px 10px 0 0;
    }
    .icon {
      margin: 0.8rem auto;
    }
  }
}
</style>

<template>
  <router-link
    v-if="internal && forUser.includes(claims.user_type)"
    :to="link"
    :title="name"
    class="link"
  >
    <inline-svg
      :src="require(`@/assets/svg/${svg}.svg`)"
      class="icon fadeIn"
      :aria-label="name"
    />
  </router-link>
  <a
    v-else
    :href="link"
    :title="name"
    @click="onClick()"
    :class="{ refresh: name === 'Refresh' }"
    class="link"
  >
    <inline-svg
      :src="require(`@/assets/svg/${svg}.svg`)"
      class="icon fadeIn"
      :aria-label="name"
    />
  </a>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    internal: Boolean,
    name: String,
    link: String,
    svg: String,
    forUser: Array,
    onClick: Function,
  },
  computed: mapState(["claims"]),
};
</script>
