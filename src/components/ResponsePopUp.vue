<style scoped>
.response_pop_up {
  position: fixed;
  top: 1rem;
  left: calc(38px + 3rem);
  background-color: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px 10px #28282810;
  border-radius: 5px;
  padding: 1rem;
  z-index: 999
}

@supports not (backdrop-filter: blur(10px)) {
  .response_pop_up {
    background-color: white
  }
}
@media (max-width: 768px) {
  .response_pop_up {
    max-width: 300px;
    left: .4rem
  }
}
</style>

<template>
  <div class="response_pop_up">
    <p>
      <b>
        {{ header }}
      </b>
    </p>
    <p>
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    desc: String
  }
}
</script>
