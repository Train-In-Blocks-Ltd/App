<template>
    <div v-if="!!txtInputPromise">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 w-2/3 max-w-xl"
        >
            <txt bold>{{ txtInputTitle }}</txt>
            <txt>{{ txtInputText }}</txt>
            <txt-input
                class="mt-4"
                :placeholder="txtInputPlaceholder"
                :aria-label="txtInputLabel"
                :value="txtInputValue"
                @output="
                    (data) =>
                        $store.commit('setData', {
                            attr: 'txtInputValue',
                            data,
                        })
                "
            />
            <div class="flex mt-4">
                <default-button
                    :on-click="
                        () => {
                            $parent.handleReturnInput(txtInputValue);
                            txtInputPromise(true);
                            $store.dispatch('closeTxtInputPopUp');
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
                            txtInputPromise(false);
                            $store.dispatch('closeTxtInputPopUp');
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
    computed: mapState([
        "txtInputPromise",
        "txtInputTitle",
        "txtInputText",
        "txtInputValue",
        "txtInputLabel",
        "txtInputPlaceholder",
    ]),
    methods: {
        handleBackdropClick() {
            this.txtInputPromise(false);
            this.$store.dispatch("closeTxtInputPopUp");
        },
    },
};
</script>
