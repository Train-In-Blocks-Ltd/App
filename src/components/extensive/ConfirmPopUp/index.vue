<template>
    <div v-if="!!confirmPromise">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 max-w-xl"
        >
            <txt bold>{{ confirmTitle }}</txt>
            <txt>{{ confirmText }}</txt>
            <div class="flex mt-4">
                <default-button
                    :on-click="
                        () => {
                            confirmPromise(true);
                            $store.dispatch('closeConfirmPopUp');
                        }
                    "
                    class="mr-2"
                >
                    Confirm
                </default-button>
                <default-button
                    theme="red"
                    :on-click="
                        () => {
                            confirmPromise(false);
                            $store.dispatch('closeConfirmPopUp');
                        }
                    "
                >
                    Cancel
                </default-button>
            </div>
        </div>
        <backdrop :on-click="() => handleBackdropClick()" />
    </div>
</template>

<script>
import { mapState } from "vuex";

const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "@/components/generic/Backdrop"
    );

export default {
    components: {
        Backdrop,
    },
    computed: mapState(["confirmPromise", "confirmTitle", "confirmText"]),
    watch: {
        confirmPromise(val) {
            if (val) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "auto";
        },
    },
    methods: {
        handleBackdropClick() {
            this.confirmPromise(false);
            this.$store.dispatch("closeConfirmPopUp");
        },
    },
};
</script>
