<style lang="scss">
.home--container {
  display: grid;
  margin-bottom: 2rem;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    > div:last-child {
      display: flex;
      justify-content: flex-end;
      button {
        margin: auto 0 auto 0.6rem;
      }
      input.search {
        /* stylelint-disable-next-line */
        width: 50% !important;
        margin: auto 0;
      }
    }
  }
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
}
</style>

<template>
  <wrapper id="home">
    <div
      v-if="isNewClientOpen"
      class="tab_overlay_content fadeIn delay fill_mode_both"
    >
      <new-client />
    </div>
    <div
      v-if="isWhatsNewOpen"
      class="tab_overlay_content allow_y_overflow fadeIn delay fill_mode_both"
    >
      <whats-new />
    </div>
    <div
      v-if="isInstallOpen"
      class="tab_overlay_content fadeIn delay fill_mode_both"
    >
      <install-app />
    </div>
    <div
      v-if="!isWhatsNewOpen"
      class="tab_option tab_option_large"
      aria-label="What's New"
      @click="(isWhatsNewOpen = true), willBodyScroll(false)"
    >
      <inline-svg
        :src="require('@/assets/svg/whats-new.svg')"
        aria-label="What's New"
      />
      <p class="text">What's New</p>
      <span v-if="newBuild" class="notify_badge">New</span>
    </div>
    <div
      v-if="!isInstallOpen && pwa.displayMode === 'browser tab'"
      class="tab_option icon_open_middle tab_option_small"
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
        opened_sections: isNewClientOpen || isInstallOpen || isWhatsNewOpen,
      }"
      class="section_overlay"
    />
    <div v-if="loading">
      <skeleton :type="'input_large'" class="skeleton_margin" />
      <skeleton :type="'client'" />
    </div>
    <div v-else-if="!noClients" class="home--container">
      <div class="header">
        <txt type="title">Clients</txt>
        <div>
          <txt-input
            type="search"
            rel="search"
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
const ClientsList = () =>
  import(
    /* webpackChunkName: "components.clientsList", webpackPreload: true  */ "@/components/generic/ClientsList"
  );
const NewClient = () =>
  import(
    /* webpackChunkName: "components.newclient", webpackPrefetch: true  */ "@/components/NewClient"
  );
const WhatsNew = () =>
  import(
    /* webpackChunkName: "components.whatsnew", webpackPrefetch: true  */ "@/components/WhatsNew"
  );
const InstallApp = () =>
  import(
    /* webpackChunkName: "components.installpwa", webpackPrefetch: true  */ "@/components/InstallPWA"
  );
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
    Wrapper,
    NewClient,
    WhatsNew,
    InstallApp,
    Txt,
    TxtInput,
    DefaultButton,
    ClientsList,
  },
  data() {
    return {
      persistResponse: "",
      isNewClientOpen: false,
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
      "search",
    ]),
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
