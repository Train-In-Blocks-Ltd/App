<style lang="scss" scoped>
.clients_list {
  display: grid;
  grid-gap: 2rem;
  margin-bottom: 2rem;
}
</style>

<template>
  <div class="clients_list">
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
</template>

<script>
import { mapState } from "vuex";

const ClientLink = () =>
  import(
    /* webpackChunkName: "components.clientlink", webpackPreload: true  */ "@/components/ClientLink"
  );
export default {
  components: {
    ClientLink,
  },
  computed: mapState(["clients", "search", "loading", "persistResponse"]),
};
</script>
