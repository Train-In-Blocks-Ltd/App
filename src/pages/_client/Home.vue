<template>
    <wrapper v-if="clientDetails" id="client">
        <client-header />
        <transition
            enter-active-class="fadeIn fill_mode_both delay"
            leave-active-class="fadeOut fill_mode_both"
        >
            <router-view :key="$route.fullPath" />
        </transition>
    </wrapper>
</template>

<script>
import { mapState } from "vuex";

const ClientHeader = () =>
    import(
        /* webpackChunkName: "components.clientHeader", webpackPrefetch: true  */ "./components/ClientHeader"
    );

export default {
    metaInfo() {
        return {
            title: this.loading ? "Loading..." : this.clientDetails.name,
        };
    },
    components: {
        ClientHeader,
    },
    data() {
        return {
            showOptions: false,
            showToolkit: false,
            sessions: false,
        };
    },
    computed: mapState([
        "loading",
        "silentLoading",
        "clients",
        "clientDetails",
    ]),
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        await this.$parent.setup();
        const CLIENT = this.clients.find(
            (client) =>
                client.client_id === parseInt(this.$route.params.client_id)
        );
        await this.$store.dispatch("getPlans", CLIENT.client_id);
        this.$store.commit("setData", {
            attr: "clientDetails",
            data: CLIENT,
        });
        this.$store.dispatch("endLoading");
    },
    methods: {},
};
</script>
