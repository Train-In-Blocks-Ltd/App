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
.response_pop_up svg {
  cursor: pointer;
  height: 1.6rem;
  width: 1.6rem;
  position: fixed;
  padding: .2rem;
  right: -.5rem;
  top: -.5rem;
  background-color: white;
  border: 3px solid #28282810;
  border-radius: 50%;
  transition: .6s all cubic-bezier(.165, .84, .44, 1)
}
.response_pop_up svg:hover {
  fill: white;
  background-color: #282828;
  border-color: white
}

@supports not (backdrop-filter: blur(10px)) {
  .response_pop_up {
    background-color: white
  }
}
@media (max-width: 992px) {
  .response_pop_up svg:hover {
    fill: black;
    background-color: white;
    border-color: #28282810
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
    <inline-svg
      :src="require('../assets/svg/close.svg')"
      @click="$parent.responseHeader = '', $parent.responseDesc = '', $parent.responsePersist = false"
    />
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
