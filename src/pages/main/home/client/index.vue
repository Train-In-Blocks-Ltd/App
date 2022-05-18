<template>
    <wrapper v-if="clientDetails" id="client">
        <!-- Client header -->
        <client-header />

        <!-- Session view container -->
        <transition
            enter-active-class="fadeIn fill_mode_both delay"
            leave-active-class="fadeOut fill_mode_both"
        >
            <router-view :key="$route.fullPath" />
        </transition>
    </wrapper>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appState from "../../../../store/modules/appState";
import clientStore from "../../../../store/modules/client";

const ClientHeader = () =>
    import(
        /* webpackChunkName: "components.clientHeader", webpackPrefetch: true  */ "./components/ClientHeader.vue"
    );

@Component({
    metaInfo() {
        return {
            title: appState.loading
                ? "Loading..."
                : clientStore.clientDetails?.name ?? "",
        };
    },
    components: {
        ClientHeader,
    },
})
export default class Client extends Vue {
    showOptions: boolean = false;
    showToolkit: boolean = false;
    sessions: boolean = false;

    get loading() {
        return appState.loading;
    }
    get clientDetails() {
        return clientStore.clientDetails;
    }

    async created() {
        appState.setLoading(true);
        // @ts-expect-error
        await this.$parent.setup();
        clientStore.setCurrentClient(parseInt(this.$route.params.client_id));
        await clientStore.getPlans(parseInt(this.$route.params.client_id));
        appState.stopLoaders();
    }
}
</script>
