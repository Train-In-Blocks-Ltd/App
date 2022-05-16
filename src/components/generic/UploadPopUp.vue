<template>
    <div v-if="show">
        <div
            class="fixed top-0 left-0 z-60 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 max-w-xl"
        >
            <txt bold>{{ title }}</txt>
            <txt>{{ text }}</txt>
            <input
                id="img-uploader"
                type="file"
                accept=".png, .jpeg, .jpg, .webp, .gif"
                @change="_confirm"
                class="mt-4"
            />
        </div>
        <backdrop :on-click="_cancel" />
    </div>
</template>

<script lang="ts">
import { UploadPopUpParams } from "../../store/modules/types";
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
export default class UploadPopUp extends Vue {
    show: boolean = false;
    title: string = "";
    text?: string = "";
    resolve: ((reason?: any) => void) | null = null;
    reject: ((reason?: any) => void) | null = null;

    @Watch("show")
    onShowChange(old: boolean) {
        if (old) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }

    open({ title, text }: UploadPopUpParams) {
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
        // @ts-expect-error
        this.$parent.handleImageSelect();
        this.close();
    }
    _cancel() {
        if (this.resolve) this.resolve(false);
        this.close();
    }
}
</script>
