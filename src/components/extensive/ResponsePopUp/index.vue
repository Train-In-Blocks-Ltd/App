<style lang="scss" scoped>
.response_pop_up {
  position: fixed;
  top: 1rem;
  left: calc(38px + 3rem);
  background-color: var(--overlay_glass);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: var(--low_shadow);
  border-radius: 5px;
  padding: 1rem;
  z-index: 100;
  svg {
    cursor: pointer;
    height: 1.2rem;
    width: 1.2rem;
    position: fixed;
    padding: 0.2rem;
    right: -0.5rem;
    top: -0.5rem;
    background-color: var(--base);
    border: 1px solid var(--fore);
    border-radius: 50%;
    transition: var(--transition_standard);
    &:hover {
      opacity: var(--light_opacity);
    }
  }
  .close_button {
    margin-top: 0.6rem;
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .response_pop_up {
    background-color: var(--fore);
  }
}
@media (max-width: 992px) {
  .response_pop_up svg:hover {
    fill: black;
    background-color: var(--fore);
    border-color: var(--base);
  }
}
@media (max-width: 768px) {
  .response_pop_up {
    max-width: 300px;
    left: 0.4rem;
  }
}
</style>

<template>
  <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
    <div v-if="responseOpen">
      <div class="response_pop_up">
        <txt bold>
          {{ responseTitle }}
        </txt>
        <txt>
          {{ responseDescription }}
        </txt>
        <default-button
          v-if="responsePersist"
          class="close_button"
          @click="() => $store.dispatch('closeResponsePopUp')"
        >
          Okay
        </default-button>
      </div>
      <backdrop />
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";

const Txt = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "@/components/elements/Txt"
  );
const DefaultButton = () =>
  import(
    /* webpackChunkName: "components.defaultButton", webpackPrefetch: true  */ "@/components/elements/DefaultButton"
  );
const Backdrop = () =>
  import(
    /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "@/components/generic/Backdrop"
  );

export default {
  components: {
    Txt,
    DefaultButton,
    Backdrop,
  },
  watch: {
    responseOpen() {
      if (!this.persist) {
        setTimeout(() => {
          this.$store.dispatch("closeResponsePopUp");
        }, 3000);
      }
    },
  },
  computed: mapState([
    "responseOpen",
    "responseTitle",
    "responseDescription",
    "responsePersist",
    "responseBackdrop",
  ]),
};
</script>
