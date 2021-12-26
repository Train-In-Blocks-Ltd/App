<template>
  <div v-if="clientDetails" id="client" class="view_container">
    <client-detail-header>
      <client-home-header-buttons />
    </client-detail-header>
    <transition
      enter-active-class="fadeIn fill_mode_both delay"
      leave-active-class="fadeOut fill_mode_both"
    >
      <router-view :key="$route.fullPath" />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";

const ClientDetailHeader = () =>
  import(
    /* webpackChunkName: "components.clientDetailHeader", webpackPrefetch: true  */ "@/components/generic/ClientDetailHeader"
  );
const ClientHomeHeaderButtons = () =>
  import(
    /* webpackChunkName: "components.clientHomeHeaderButtons", webpackPrefetch: true  */ "./components/ClientHomeHeaderButtons"
  );

export default {
  metaInfo() {
    return {
      title: this.loading ? "Loading..." : this.clientDetails.name,
    };
  },
  components: {
    ClientDetailHeader,
    ClientHomeHeaderButtons,
  },
  computed: mapState(["loading", "clients", "clientDetails"]),
  async created() {
    this.$store.commit("setData", {
      attr: "loading",
      data: true,
    });
    this.willBodyScroll(true);
    await this.$parent.setup();
    const CLIENT = this.clients.find(
      (client) => client.client_id === parseInt(this.$route.params.client_id)
    );
    await this.$store.dispatch("getPlans", CLIENT.client_id);
    this.$store.commit("setData", {
      attr: "clientDetails",
      data: CLIENT,
    });
    this.$store.dispatch("endLoading");
  },
};
</script>
