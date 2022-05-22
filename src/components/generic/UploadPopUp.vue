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
import Compressor from "compressorjs";
import { baseAPI } from "../../api";
import utilsModule from "../../store/modules/utils.module";

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
    onSuccess: ((response: { data: { url: string } }) => void) | null = null;

    @Watch("show")
    onShowChange(old: boolean) {
        if (old) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }

    open({ title, text, onSuccess }: UploadPopUpParams) {
        this.show = true;
        this.title = title;
        this.text = text;
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

    /** Adds an image. */
    handleImageSelect() {
        const uploader = document.getElementById(
            "img-uploader"
        ) as HTMLElement & { files: any[] };
        if (!uploader) return;
        const file = uploader.files[0];
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            () => {
                baseAPI
                    .post("/.netlify/functions/upload-image", {
                        file: reader.result?.toString(),
                    })
                    .then((response) => {
                        if (this.onSuccess) this.onSuccess(response);
                    });
            },
            false
        );

        if (file.size < 1100000) {
            // eslint-disable-next-line
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    reader.readAsDataURL(result);
                },
                error(err) {
                    console.error(err.message);
                },
            });
        } else {
            utilsModule.responsePopUpRef?.open({
                title: "File size is too big",
                text: "Please compress it to 1MB or lower",
                persist: true,
                backdrop: true,
            });
            const uploader = document.getElementById(
                "img-uploader"
            ) as HTMLElement & { value: any };
            if (!uploader) return;
            uploader.value = "";
        }
    }

    _confirm() {
        if (this.resolve) this.resolve(true);
        this.handleImageSelect();
        this.close();
    }
    _cancel() {
        if (this.resolve) this.resolve(false);
        this.close();
    }
}
</script>
