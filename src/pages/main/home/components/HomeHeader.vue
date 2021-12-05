<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  > .right {
    display: flex;
    align-items: center;
    .search,
    .new_client_button {
      margin-right: 0.6rem;
    }
  }
}

@media (max-width: 768px) {
  .header {
    display: grid;
    grid-gap: 1rem;
    justify-content: unset;
    > div:last-child {
      justify-content: space-between;
      button {
        margin-left: 0;
      }
    }
  }
}
</style>

<template>
  <div class="header">
    <txt type="title" isMain>Clients</txt>
    <div class="right">
      <txt-input
        type="search"
        rel="search"
        class="search"
        placeholder="Find a client"
        aria-label="Find a client"
        :value="search"
        @output="
          (data) =>
            $store.commit('setData', {
              attr: 'search',
              data,
            })
        "
      />
      <default-button
        :on-click="
          () => {
            $store.dispatch('openModal', { name: 'new-client' });
            willBodyScroll(false);
          }
        "
        class="new_client_button"
      >
        New Client
      </default-button>
      <icon-button
        svg="bookmark"
        :on-click="
          () => {
            $store.dispatch('openModal', { name: 'whats-new', size: 'lg' });
            willBodyScroll(false);
          }
        "
        :icon-size="28"
        svg-class="no_fill"
      />
    </div>
  </div>
</template>

<script>
const Txt = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "@/components/elements/Txt"
  );
const TxtInput = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "@/components/elements/TxtInput"
  );
const DefaultButton = () =>
  import(
    /* webpackChunkName: "components.defaultButton", webpackPrefetch: true  */ "@/components/elements/DefaultButton"
  );
const IconButton = () =>
  import(
    /* webpackChunkName: "components.iconButton", webpackPrefetch: true  */ "@/components/elements/IconButton"
  );

export default {
  components: {
    Txt,
    TxtInput,
    DefaultButton,
    IconButton,
  },
  computed: {
    search: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.$store.commit("setData", {
          attr: "search",
          data: value,
        });
      },
    },
  },
};
</script>
