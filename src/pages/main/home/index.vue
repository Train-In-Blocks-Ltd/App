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
    <div
      v-if="isInstallOpen"
      class="tab_overlay_content fadeIn delay fill_mode_both"
    >
      <install-app />
    </div>
    <div
      v-if="!isInstallOpen && pwa.displayMode === 'browser tab'"
      class="tab_option tab_option_small"
      aria-label="Install Train In Blocks"
      @click="(isInstallOpen = true), willBodyScroll(false)"
    >
      <inline-svg
        :src="require('@/assets/svg/install-pwa.svg')"
        aria-label="Install Train In Blocks"
      />
      <p class="text">Install</p>
    </div>
    <div
      :class="{
        opened_sections: isInstallOpen || isWhatsNewOpen,
      }"
      class="section_overlay"
    />
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
const InstallApp = () =>
  import(
    /* webpackChunkName: "components.installpwa", webpackPrefetch: true  */ "@/components/InstallPWA"
  );

export default {
  components: {
    Wrapper,
    InstallApp,
    ClientsList,
    HomeHeader,
  },
  data() {
    return {
      persistResponse: "",
      isInstallOpen: false,
      isWhatsNewOpen: false,
    };
  },
  computed: {
    ...mapState([
      "newBuild",
      "clients",
      "noClients",
      "loading",
      "pwa",
      "modalOpen",
    ]),
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
