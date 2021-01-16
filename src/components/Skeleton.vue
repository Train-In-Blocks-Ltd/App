<style scoped>
  .add_margin {
    margin: 2rem 0
  }
  .rect {
    display: grid;
    grid-gap: 2rem;
    padding: 2rem;
    background-color: #E4E4E4;
    border-radius: 10px;
    animation: fade .6s linear infinite alternate-reverse
  }
  .rect__title, .rect__content, .rect__box {
    background: linear-gradient(90deg, #F4F4F4 8%, #E4E4E4 18%, #F4F4F4 33%);
    border-radius: 10px;
    animation: shimmer 5s linear infinite forwards
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

  @keyframes fade {
    from {
      opacity: .6
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
</style>

<template>
  <div>
    <div v-if="type === 'session'" class="rect add_margin">
      <div class="rect__title" />
      <div class="rect__title" />
      <div class="rect__content one" />
      <div class="rect__content two" />
      <div class="rect__box" />
    </div>
    <div v-if="type === 'plan'" class="rect add_margin">
      <div class="rect__title" />
      <div class="rect__content one" />
      <div class="rect__content one" />
    </div>
    <div v-if="type === 'client'" class="rect">
      <div class="rect__title" />
      <div class="rect__content two" />
      <div class="rect__content two" />
      <div class="rect__content one" />
      <div class="rect__content one" />
    </div>
    <div v-if="type === 'archived'" class="rect">
      <div class="rect__title" />
      <div class="rect__content two" />
      <div class="rect__content two" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String
  }
}
</script>
