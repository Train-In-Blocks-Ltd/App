<style lang="scss" scoped>
.wrapper {
  position: relative;
  background-color: var(--back);
  padding: 2rem 10vw;
}

@media (min-width: 1440px) {
  .wrapper {
    padding: 2rem 20vw;
  }
}
@media (max-width: 768px) {
  .wrapper {
    padding: 2rem 5vw 5rem 5vw;
  }
}
</style>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>
