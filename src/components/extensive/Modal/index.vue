<style lang="scss" scoped>
.modal_wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  .modal {
    position: fixed;
    top: 10rem;
    padding: 2rem;
    border-radius: var(--rounded);
    background-color: var(--fore);
    box-shadow: var(--high_shadow);
    z-index: 100;
    width: 600px;
    .header {
      margin-bottom: 1.6rem;
    }
  }
}
</style>

<template>
  <div v-if="modalOpen" class="modal_wrapper">
    <div class="modal">
      <secondary-header :title="title()" class="header">
        <template v-slot:right>
          <icon-button
            svg="close"
            :on-click="() => $store.dispatch('closeModal')"
          />
        </template>
      </secondary-header>
      <new-client-modal v-if="modalContent === 'new-client'" />
    </div>
    <backdrop />
  </div>
</template>

<script>
import { mapState } from "vuex";

const Backdrop = () =>
  import(
    /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "@/components/generic/Backdrop"
  );
const SecondaryHeader = () =>
  import(
    /* webpackChunkName: "components.secondaryHeader", webpackPrefetch: true  */ "../SecondaryHeader"
  );
const IconButton = () =>
  import(
    /* webpackChunkName: "components.iconButton", webpackPrefetch: true  */ "@/components/elements/IconButton"
  );

// Modals

const NewClientModal = () =>
  import(
    /* webpackChunkName: "components.newClientModal", webpackPrefetch: true  */ "@/pages/main/home/components/NewClientModal"
  );

export default {
  components: {
    Backdrop,
    SecondaryHeader,
    IconButton,
    NewClientModal,
  },
  computed: mapState(["modalOpen", "modalContent"]),
  methods: {
    title() {
      switch (this.modalContent) {
        case "new-client":
          return "New Client";
        default:
          return "";
      }
    },
  },
};
</script>
