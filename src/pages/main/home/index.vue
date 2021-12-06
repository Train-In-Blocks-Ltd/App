<style lang="scss">
.home--container {
  display: grid;
  margin-bottom: 2rem;
}
.skeleton_margin {
  margin-bottom: 2rem;
  &.shorter {
    width: 40%;
  }
}

@media (max-width: 768px) {
  .home--container {
    width: 100%;
  }
}
</style>

<template>
  <wrapper id="home">
    <div v-if="loading">
      <skeleton :type="'input_large'" class="skeleton_margin" />
      <skeleton :type="'client'" />
    </div>
    <div v-else-if="!noClients" class="home--container">
      <home-header />
      <clients-list />
    </div>
    <p v-else class="text--holder text--small grey">
      No clients added yet, use the button on the top-right of your screen.
    </p>
  </wrapper>
</template>

<script>
import { mapState } from "vuex";
const Wrapper = () =>
  import(
    /* webpackChunkName: "components.wrapper", webpackPreload: true  */ "@/components/generic/Wrapper"
  );
const HomeHeader = () =>
  import(
    /* webpackChunkName: "components.homeHeader", webpackPreload: true  */ "./components/HomeHeader"
  );
const ClientsList = () =>
  import(
    /* webpackChunkName: "components.clientsList", webpackPreload: true  */ "@/components/generic/ClientsList"
  );

export default {
  components: {
    Wrapper,
    ClientsList,
    HomeHeader,
  },
  data() {
    return {
      persistResponse: "",
    };
  },
  computed: {
    ...mapState(["noClients", "loading", "modalOpen"]),
  },
  async created() {
    this.$store.commit("setData", {
      attr: "loading",
      data: true,
    });
    this.$store.commit("setData", {
      attr: "clientDetails",
      data: null,
    });
    await this.$parent.setup();
    this.$store.dispatch("endLoading");
  },
};
</script>
