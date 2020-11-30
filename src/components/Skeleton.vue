<style scoped>
  .session {
    display: grid;
    grid-gap: 2rem;
    padding: 2rem;
    background-color: #F4F4F4;
    margin: 2rem 0;
    border-radius: 3px;
    animation: fade .6s linear infinite alternate-reverse
  }
  .session__title, .session__content, .session__box {
    background: linear-gradient(90deg, white 8%, #F4F4F4 18%, white 33%);
    border-radius: 3px;
    animation: shimmer 5s linear infinite forwards
  }
  .session__title, .session__content {
    height: 1rem
  }
  .session__title {
    width: 20%
  }
  .session__content.one {
    width: 50%
  }
  .session__content.two {
    width: 40%;
  }
  .session__box {
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
    <div v-if="type === 'session'" class="session">
      <div class="session__title" />
      <div class="session__title" />
      <div class="session__content one" />
      <div class="session__content two" />
      <div class="session__box" />
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