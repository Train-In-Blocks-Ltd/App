<template>
    <wrapper id="home">
        <div v-if="loading">
            <skeleton :type="'input_large'" class="mb-8" />
            <skeleton :type="'client'" />
        </div>
        <div v-else-if="!noClients" class="grid mb-8">
            <home-header />
            <clients-list />
        </div>
        <p v-else class="text--holder text--small grey">
            No clients added yet, use the button on the top-right of your
            screen.
        </p>
    </wrapper>
</template>

<script>
import { mapState } from "vuex";

const HomeHeader = () =>
    import(
        /* webpackChunkName: "components.homeHeader", webpackPreload: true  */ "./components/HomeHeader"
    );
const ClientsList = () =>
    import(
        /* webpackChunkName: "components.clientsList", webpackPreload: true  */ "@/components/generic/ClientsList"
    );

export default {
    components: {
        ClientsList,
        HomeHeader,
    },
    data() {
        return {
            persistResponse: "",
        };
    },
    computed: {
        ...mapState(["noClients", "loading", "modalOpen"]),
    },
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
