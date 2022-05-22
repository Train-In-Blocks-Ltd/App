<template>
    <div v-if="show">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 w-2/3 max-w-xl"
        >
            <txt bold>{{ title }}</txt>
            <txt>{{ text }}</txt>
            <txt-input
                class="mt-4"
                :placeholder="placeholder"
                :aria-label="label"
                :value="value"
                @output="(data) => (value = data)"
            />
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
                    :on-click="_cancel"
                    aria-label="Cancel"
                >
                    Cancel
                </default-button>
            </div>
        </div>
        <backdrop :on-click="_cancel" />
    </div>
</template>

<script lang="ts">
import { TxtInputPopUpParams } from "../../common/types";
import { Component, Vue, Watch } from "vue-property-decorator";

const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "../../components/generic/Backdrop.vue"
    );

@Component({
    components: {
        Backdrop,
    },
})
export default class TxtInputPopUp extends Vue {
    show: boolean = false;
    title: string = "";
    text?: string = "";
    label?: string = "";
    value?: string = "";
    placeholder?: string = "";
    resolve: ((reason?: any) => void) | null = null;
    reject: ((reason?: any) => void) | null = null;
    onSuccess: ((link: string) => void) | null = null;

    @Watch("show")
    onShowChange(old: boolean) {
        if (old) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }

    open({ title, text, label, placeholder, onSuccess }: TxtInputPopUpParams) {
        this.show = true;
        this.title = title;
        this.text = text;
        this.label = label;
        this.placeholder = placeholder;
        this.onSuccess = onSuccess;

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
        if (this.onSuccess) this.onSuccess(this.value ?? "");
        this.close();
    }
    _cancel() {
        if (this.resolve) this.resolve(false);
        this.close();
    }
}
</script>
