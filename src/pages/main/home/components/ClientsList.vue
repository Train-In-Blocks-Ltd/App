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
            class="no-underline"
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
