<template>
    <div class="grid gap-8 mb-8">
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
        /* webpackChunkName: "components.clientLink", webpackPreload: true  */ "@/components/ClientLink"
    );

export default {
    components: {
        ClientLink,
    },
    computed: mapState(["clients", "search", "loading"]),
};
</script>
