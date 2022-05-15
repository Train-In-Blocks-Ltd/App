<template>
    <div v-if="responseOpen">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 w-2/3 max-w-xl"
        >
            <txt bold>
                {{ responseTitle }}
            </txt>
            <txt>
                {{ responseDescription }}
            </txt>
            <default-button
                v-if="responsePersist"
                class="mt-4"
                aria-label="Okay"
                :on-click="() => $store.dispatch('closeResponsePopUp')"
            >
                Okay
            </default-button>
        </div>
        <backdrop v-if="responseBackdrop" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import utilsStore from "../../../store/modules/utils";

const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "../../../components/generic/Backdrop.vue"
    );

@Component({
    components: {
        Backdrop,
    },
})
export default class ResponsePopUp extends Vue {
    get responseOpen() {
        return utilsStore.responseOpen;
    }
    get responseTitle() {
        return utilsStore.responseTitle;
    }
    get responseDescription() {
        return utilsStore.responseDescription;
    }
    get responsePersist() {
        return utilsStore.responsePersist;
    }
    get responseBackdrop() {
        return utilsStore.responseBackdrop;
    }

    @Watch("responseOpen")
    onResponseOpen(old: boolean) {
        if (!this.responsePersist) {
            setTimeout(() => {
                this.$store.dispatch("closeResponsePopUp");
            }, 3000);
        }
        if (old) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }
}
</script>
