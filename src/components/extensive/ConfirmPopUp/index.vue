<template>
    <div
        v-if="!!confirmPromise"
        class="fixed top-0 left-0 z-50 bg-white shadow-lg rounded-lg ml-8 mt-8 p-4 w-1/3"
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
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["confirmPromise", "confirmTitle", "confirmText"]),
};
</script>
