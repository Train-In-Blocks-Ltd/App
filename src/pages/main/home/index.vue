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
import { Component, Vue } from "vue-property-decorator";
import appState from "../../../store/modules/appState";

const HomeHeader = () =>
    import(
        /* webpackChunkName: "components.homeHeader", webpackPreload: true  */ "./components/HomeHeader.vue"
    );
const ClientsList = () =>
    import(
        /* webpackChunkName: "components.clientsList", webpackPreload: true  */ "./components/ClientsList.vue"
    );

@Component({
    components: {
        ClientsList,
        HomeHeader,
    },
})
export default class Home extends Vue {
    persistResponse: string = "";

    get loading() {
        return appState.loading;
    }

    // TODO: Need to readd modal
    get modalOpen() {
        return false;
    }

    async created() {
        appState.setLoading(true);
        // @ts-expect-error
        await this.$parent.setup();
        appState.setLoading(false);
    }
}
</script>
