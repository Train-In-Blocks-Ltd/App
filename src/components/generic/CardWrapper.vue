<style lang="scss" scoped>
.card_wrapper {
  color: var(--base);
  border: 3px solid var(--base);
  border-radius: 10px;
  background: var(--back);
  &.animated {
    transition: var(--transition_standard);
  }
  &.has_hover:hover,
  &.has_shadow {
    box-shadow: var(--high_shadow);
  }
}

@media (max-width: var(--md)) {
  .client_wrapper {
    &.has_hover:hover,
    &.has_shadow {
      box-shadow: var(--low_shadow);
    }
    &:active {
      transform: var(--active_state);
    }
  }
}
</style>

<template>
  <div
    :class="[
      'card_wrapper',
      { animated: !noTransition, has_hover: !noHover, has_shadow: hasShadow },
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    noTransition: Boolean,
    noHover: Boolean,
    hasShadow: Boolean,
  },
};
</script>
