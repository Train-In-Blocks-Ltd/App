<template>
    <wrapper v-if="clientDetails" id="client">
        <!-- Client header -->
        <client-header v-if="!loading" />

        <!-- Session view container -->
        <transition
            enter-active-class="fadeIn fill_mode_both delay"
            leave-active-class="fadeOut fill_mode_both"
        >
            <router-view v-if="loaded" :key="$route.fullPath" />
        </transition>
    </wrapper>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../store/app.module";
import clientModule from "../../../../store/client.module.";

const ClientHeader = () =>
    import(
        /* webpackChunkName: "components.clientHeader", webpackPrefetch: true  */ "./components/ClientHeader.vue"
    );

@Component({
    metaInfo(this: Client) {
        return {
            title: this.loading ? "Loading..." : this.clientDetails?.name,
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
    loaded: boolean = false;

    get loading() {
        return appModule.loading;
    }
    get clientDetails() {
        return clientModule.clientDetails;
    }

    async created() {
        this.loaded = false;
        clientModule.setCurrentClient(parseInt(this.$route.params.client_id));
        await clientModule.getPlans(parseInt(this.$route.params.client_id));
        this.loaded = true;
    }
}
</script>
