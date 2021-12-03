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
  <div id="home" class="view_container">
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
        :src="require('../assets/svg/whats-new.svg')"
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
        :src="require('../assets/svg/install-pwa.svg')"
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
            v-model="search"
            type="search"
            rel="search"
            placeholder="Find a client"
            aria-label="Find a client"
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
      <div class="clients_container">
        <!-- Perform case insensitive search -->
        <router-link
          v-for="(client, index) in clients"
          v-show="
            (!search ||
              client.name.toLowerCase().startsWith(search.toLowerCase())) &&
            !loading
          "
          :id="'a' + client.client_id"
          :key="index"
          :to="'/client/' + client.client_id + '/'"
          class="client_link_wrapper"
        >
          <client-link
            :client="client"
            :archive="false"
            :class="{ recently_added: persistResponse === client.name }"
          />
        </router-link>
      </div>
    </div>
    <p v-else class="text--holder text--small grey">
      No clients added yet, use the button on the top-right of your screen.
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
const ClientLink = () =>
  import(
    /* webpackChunkName: "components.clientlink", webpackPreload: true  */ "@components/ClientLink"
  );
const NewClient = () =>
  import(
    /* webpackChunkName: "components.newclient", webpackPrefetch: true  */ "@components/NewClient"
  );
const WhatsNew = () =>
  import(
    /* webpackChunkName: "components.whatsnew", webpackPrefetch: true  */ "@components/WhatsNew"
  );
const InstallApp = () =>
  import(
    /* webpackChunkName: "components.installpwa", webpackPrefetch: true  */ "@components/InstallPWA"
  );
const Txt = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "@components/elements/Txt"
  );
const TxtInput = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "@components/elements/TxtInput"
  );
const DefaultButton = () =>
  import(
    /* webpackChunkName: "components.defaultButton", webpackPrefetch: true  */ "@components/elements/DefaultButton"
  );

export default {
  components: {
    ClientLink,
    NewClient,
    WhatsNew,
    InstallApp,
    Txt,
    TxtInput,
    DefaultButton,
  },
  data() {
    return {
      persistResponse: "",
      isNewClientOpen: false,
      isInstallOpen: false,
      isWhatsNewOpen: false,
      search: "",
    };
  },
  computed: mapState(["newBuild", "clients", "noClients", "loading", "pwa"]),
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
