<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  > div:last-child {
    display: flex;
    justify-content: flex-end;
    .search {
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
    <txt type="title">Clients</txt>
    <div>
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
            isNewClientOpen = true;
            willBodyScroll(false);
          }
        "
      >
        New Client
      </default-button>
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

export default {
  components: {
    Txt,
    TxtInput,
    DefaultButton,
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
