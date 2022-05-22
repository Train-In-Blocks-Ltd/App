<template>
    <div v-if="loading" class="skeleton-box animate-pulse p-4 sm:p-8">
        <div class="skeleton-item-lg" />
        <div class="skeleton-item" />
        <div class="skeleton-item" />
    </div>
    <div v-else-if="!loading && clients.length > 0" class="grid gap-8 mb-8">
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
    <txt v-else type="large-body" grey>
        No clients added yet, use the button on the top-right of your screen.
    </txt>
</template>

<script lang="ts">
import appModule from "../../../../store/app.module";
import clientsModule from "../../../../store/clients.module";
import { Component, Vue } from "vue-property-decorator";
import utils from "../../../../store/utils.module";

const ClientLink = () =>
    import(
        /* webpackChunkName: "components.clientLink", webpackPreload: true  */ "../../../../components/generic/ClientLink.vue"
    );

@Component({
    components: {
        ClientLink,
    },
})
export default class ClientList extends Vue {
    get loading() {
        return appModule.loading;
    }
    get search() {
        return utils.search;
    }
    get clients() {
        return clientsModule.clients;
    }
}
</script>
