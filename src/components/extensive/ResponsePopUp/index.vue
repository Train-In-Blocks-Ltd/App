<template>
    <div v-if="responseOpen">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-2 sm:ml-8 mt-8 p-4 w-2/3 max-w-xl"
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
                :on-click="() => $store.dispatch('closeResponsePopUp')"
            >
                Okay
            </default-button>
        </div>
        <backdrop v-if="responseBackdrop" />
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
    watch: {
        responseOpen(val) {
            if (!this.responsePersist) {
                setTimeout(() => {
                    this.$store.dispatch("closeResponsePopUp");
                }, 3000);
            }
            if (val) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "auto";
        },
    },
    computed: mapState([
        "responseOpen",
        "responseTitle",
        "responseDescription",
        "responsePersist",
        "responseBackdrop",
    ]),
};
</script>
