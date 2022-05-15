<template>
    <wrapper id="home">
        <div class="grid mb-8">
            <home-header />
            <clients-list />
            <txt v-if="!loading" type="large-body" grey>
                No clients added yet, use the button on the top-right of your
                screen.
            </txt>
        </div>
    </wrapper>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import appState from "../../../store/modules/appState";

const HomeHeader = () =>
    import(
        /* webpackChunkName: "components.homeHeader", webpackPreload: true  */ "./components/HomeHeader.vue"
    );
const ClientsList = () =>
    import(
        /* webpackChunkName: "components.clientsList", webpackPreload: true  */ "./components/ClientsList.vue"
    );

export default Vue.extend({
    components: {
        ClientsList,
        HomeHeader,
    },
    data() {
        return {
            persistResponse: "",
        };
    },
    computed: mapState(["loading", "modalOpen"]),
    async created() {
        appState.setLoading(true);
        // @ts-expect-error
        await this.$parent.setup();
        this.$store.dispatch("setLoading", false);
    },
});
</script>
