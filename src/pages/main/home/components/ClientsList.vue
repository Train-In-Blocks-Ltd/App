<template>
    <div v-if="loading" class="skeleton-box animate-pulse p-4 sm:p-8">
        <div class="skeleton-item-lg" />
        <div class="skeleton-item" />
        <div class="skeleton-item" />
    </div>
    <div v-else class="grid gap-8 mb-8">
        <!-- Perform case insensitive search -->
        <router-link
            v-for="(client, index) in clients"
            v-show="
                (!search ||
                    client.name
                        .toLowerCase()
                        .startsWith(search.toLowerCase())) &&
                !loading
            "
            :id="'a' + client.client_id"
            :key="index"
            :to="'/client/' + client.client_id + '/'"
        >
            <client-link :client="client" />
        </router-link>
    </div>
</template>

<script>
import { mapState } from "vuex";

const ClientLink = () =>
    import(
        /* webpackChunkName: "components.clientLink", webpackPreload: true  */ "@/components/generic/ClientLink"
    );

export default {
    components: {
        ClientLink,
    },
    computed: mapState(["clients", "search", "loading"]),
};
</script>
