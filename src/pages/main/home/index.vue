<template>
    <wrapper id="home">
        <div class="grid mb-8">
            <home-header />
            <clients-list />
        </div>
    </wrapper>
</template>

<script lang="ts">
import utilsModule from "../../../store/utils.module";
import { Component, Vue } from "vue-property-decorator";

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

    mounted() {
        utilsModule.openModal({
            name: "preview",
            previewTitle: "Thanks for being on this journey with us!",
            previewHTML:
                "<p>We've taken the unfortunate decision and am sorry to inform you that we are closing down the business. Your account will remain active until the <b>12th of September 2022 at 6pm BST</b> where you won't be able to sign into your account anymore. We recommend for you to switch to a different platform like TrueCoach or MyPTHub before this date.</p><br /><p>Finally, we want to thank all of you who have been with us till the end. We really appreciate your support and we wish you the best prospects where-ever your business takes you.</p><br/><p>All the best,</p><p>The Train In Blocks Team</p>",
        });
    }
}
</script>
