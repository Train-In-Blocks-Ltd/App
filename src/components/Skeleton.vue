<style lang="scss" scoped>
.large_margin {
  margin: 4rem 0
}
.small_margin {
  margin: 2rem 0
}
.large_padding {
  padding: 2rem
}
.small_padding {
  padding: 1rem
}
.mini_padding {
  padding: .6rem
}
.plans_layout > div, .rect {
  display: grid;
  grid-gap: 2rem;
  width: 100%;
  background-color: var(--skeleton_2);
  border-radius: 10px;
  animation: fade .6s linear infinite alternate-reverse
}
.rect__title, .rect__content, .rect__box, .rect__large_text, .rect__small_text {
  background: linear-gradient(90deg, var(--skeleton_1) 8%, var(--skeleton_2) 18%, var(--skeleton_1) 33%);
  border-radius: 10px;
  animation: shimmer 5s linear infinite forwards
}
.rect__large_text {
  height: 2.6rem;
  width: 80%
}
.rect__small_text {
  height: 1.6rem
}
.width_60 {
  width: 60%
}
.rect__title, .rect__content {
  height: 1rem
}
.rect__title {
  width: 20%
}
.rect__content.one {
  width: 50%
}
.rect__content.two {
  width: 40%
}
.rect__box {
  height: 6rem;
  width: 60%
}
.circle {
  height: 140px;
  width: 140px;
  border-radius: 50%;
  margin: 0 auto;
  background-color: var(--skeleton_2);
  animation: fade .6s linear infinite alternate-reverse
}

@keyframes fade {
  from {
    opacity: var(--light_opacity)
  }
  to {
    opacity: 1
  }
}
@keyframes shimmer {
  from {
    background-position: 0 0
  }
  to {
    background-position: 100rem 0
  }
}
@keyframes shimmerVertical {
  from {
    background-position: 0 0
  }
  to {
    background-position: 0 100rem
  }
}

/* Plans */
.plans_layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  &.largeScreen:not(.keepSmall) {
    grid-template-columns: repeat(3, 1fr)
  }
}
@media (max-width: 992px) {
  .plans_layout {
    margin-top: 2rem;
    grid-template-columns: 1fr
  }
  .plans_layout > div {
    margin: 0
  }
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: calc(38px + 2rem);
  padding: 1rem;
  background-color: var(--skeleton_2);
  animation: fade .6s linear infinite alternate-reverse
}
@media (max-width: 768px) {
  .sidebar {
    top: unset;
    bottom: 0;
    height: 60.8px;
    width: 100vw
  }
}
</style>

<template>
  <div>
    <div v-if="type === 'session'" class="rect small_margin large_padding">
      <div class="rect__title" />
      <div class="rect__title" />
      <div class="rect__content one" />
      <div class="rect__content two" />
      <div class="rect__box" />
    </div>
    <div
      v-if="type === 'plan' || type === 'product'"
      :class="{ largeScreen: screenSize >= 1440, keepSmall: type === 'product'}"
      class="plans_layout"
    >
      <div class="large_padding small_margin">
        <div class="rect__title" />
        <div class="rect__content one" />
        <div class="rect__content one" />
      </div>
      <div class="large_padding small_margin">
        <div class="rect__title" />
        <div class="rect__content one" />
        <div class="rect__content one" />
      </div>
      <div
        v-if="screenSize >= 1440 && type !== 'product'"
        class="large_padding small_margin"
      >
        <div class="rect__title" />
        <div class="rect__content one" />
        <div class="rect__content one" />
      </div>
    </div>
    <div v-if="type === 'client'" class="rect large_padding">
      <div class="rect__title" />
      <div class="rect__content two" />
      <div class="rect__content two" />
      <div class="rect__content one" />
      <div class="rect__content one" />
    </div>
    <div v-if="type === 'archived'" class="rect large_padding">
      <div class="rect__title" />
      <div class="rect__content two" />
      <div class="rect__content two" />
    </div>
    <div v-if="type === 'input_large'" class="rect mini_padding">
      <div class="rect__large_text" />
    </div>
    <div v-if="type === 'input_small'" class="rect mini_padding">
      <div class="rect__small_text width_60" />
    </div>
    <div v-if="type === 'profile_image'" class="circle" />
    <div v-if="type === 'bookings'" class="rect large_padding">
      <div class="rect__small_text width_60" />
      <div class="rect__content two" />
      <div class="rect__content one" />
    </div>
    <div v-if="type === 'button'" class="rect mini_padding">
      <div class="rect__small_text" />
    </div>
    <div v-if="type === 'nav'" class="sidebar" />
  </div>
</template>

<script>
export default {
  props: {
    type: String
  },
  data () {
    return {
      screenSize: window.innerWidth
    }
  }
}
</script>
