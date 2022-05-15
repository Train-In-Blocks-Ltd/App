<template>
    <div v-if="confirmOpen">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 max-w-xl"
        >
            <txt bold>{{ confirmTitle }}</txt>
            <txt>{{ confirmText }}</txt>
            <div class="flex mt-4">
                <default-button
                    :on-click="handleResolve"
                    aria-label="Confirm"
                    class="mr-2"
                >
                    Confirm
                </default-button>
                <default-button
                    theme="red"
                    aria-label="Cancel"
                    :on-click="handleReject"
                >
                    Cancel
                </default-button>
            </div>
        </div>
        <backdrop :on-click="() => handleBackdropClick()" />
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
export default class ConfirmPopUp extends Vue {
    get confirmOpen() {
        return utilsStore.confirmOpen;
    }
    get confirmTitle() {
        return utilsStore.confirmTitle;
    }
    get confirmText() {
        return utilsStore.confirmText;
    }
    get confirmResolve() {
        return utilsStore.confirmResolve;
    }

    @Watch("confirmOpen")
    onConfirmOpen(old: boolean) {
        if (old) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }

    handleResolve() {
        this.confirmResolve();
        utilsStore.closeConfirmPopUp();
    }
    handleReject() {
        utilsStore.closeConfirmPopUp();
    }
}
</script>
