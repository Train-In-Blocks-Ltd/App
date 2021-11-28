<style lang="scss" scoped>
.card_wrapper {
  border: 3px solid var(--base);
  border-radius: 10px;
  background: var(--back);
}
</style>

<template>
  <div class="card_wrapper">
    <slot />
  </div>
</template>
