<template>
    <div v-if="show">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 max-w-xl"
        >
            <txt bold>{{ title }}</txt>
            <txt>{{ text }}</txt>
            <div class="flex mt-4">
                <default-button
                    :on-click="_confirm"
                    aria-label="Confirm"
                    class="mr-2"
                >
                    Confirm
                </default-button>
                <default-button
                    theme="red"
                    aria-label="Cancel"
                    :on-click="_cancel"
                >
                    Cancel
                </default-button>
            </div>
        </div>
        <backdrop :on-click="_cancel" />
    </div>
</template>

<script lang="ts">
import { ConfirmPopUpParams } from "../../../store/modules/types";
import { Component, Vue } from "vue-property-decorator";

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
    show: boolean = false;
    title: string = "";
    text?: string = "";
    resolve: ((reason?: any) => void) | null = null;
    reject: ((reason?: any) => void) | null = null;

    open({ title, text }: ConfirmPopUpParams) {
        this.show = true;
        this.title = title;
        this.text = text;

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    close() {
        this.show = false;
        this.title = "";
        this.text = "";
        this.resolve = null;
        this.reject = null;
    }

    _confirm() {
        if (this.resolve) this.resolve(true);
        this.close();
    }
    _cancel() {
        if (this.resolve) this.resolve(false);
        this.close();
    }
}
</script>
