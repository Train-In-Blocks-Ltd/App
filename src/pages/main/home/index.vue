<template>
    <wrapper id="home">
        <div class="grid mb-8">
            <home-header />
            <clients-list v-if="clients.length > 0 && !loading" />
            <txt v-else type="large-body" grey>
                No clients added yet, use the button on the top-right of your
                screen.
            </txt>
        </div>
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
        /* webpackChunkName: "components.clientsList", webpackPreload: true  */ "./components/ClientsList"
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
    computed: mapState(["clients", "loading", "modalOpen"]),
    async created() {
        this.$store.dispatch("setLoading", {
            loading: true,
        });
        this.$store.commit("SET_DATA", {
            attr: "clientDetails",
            data: null,
        });
        await this.$parent.setup();
        this.$store.dispatch("setLoading", false);
    },
};
</script>
