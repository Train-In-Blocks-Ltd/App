<style lang="scss" scoped>
button {
  user-select: none;
  cursor: pointer;
  align-self: center;
  border-radius: 5px;
  text-transform: capitalize;
  outline-width: 0;
  border: none;
  padding: 0.6rem 1.6rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--back);
  background-color: var(--base);
  transition: color 0.4s, background-color 0.4s, opacity 0.2s,
    transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover:not(:disabled) {
    opacity: var(--light_opacity);
  }
  &:active:not(:disabled) {
    transform: var(--active_state);
  }
  &:focus {
    box-shadow: 0 0 0 4px var(--base_light);
  }
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: var(--light_opacity);
  }
  &.green,
  &.red {
    color: white;
  }
  &.green {
    background-color: green;
  }
  &.red {
    background-color: #b80000;
  }
}
</style>

<template>
  <button
    v-if="onClickPrevent"
    :class="theme"
    @click.prevent="
      () => {
        if (onClickPrevent) onClickPrevent();
      }
    "
    :disabled="isDisabled"
  >
    <slot />
  </button>
  <button
    v-else
    :class="theme"
    @click="
      () => {
        if (onClick) onClick();
      }
    "
    :disabled="isDisabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    theme: String,
    onClick: Function,
    onClickPrevent: Function,
    isDisabled: Boolean,
  },
};
</script>
