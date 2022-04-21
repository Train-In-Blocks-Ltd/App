<template>
    <div v-if="!!uploadPromise">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-2 sm:ml-8 mt-8 p-4 max-w-xl"
        >
            <txt bold>{{ uploadTitle }}</txt>
            <txt>{{ uploadText }}</txt>
            <input
                id="img-uploader"
                type="file"
                accept=".png, .jpeg, .jpg, .webp, .gif"
                @change="
                    () => {
                        $parent.handleImageSelect();
                        $store.dispatch('closeUploadPopUp');
                    }
                "
                class="mt-4"
            />
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
    computed: mapState(["uploadPromise", "uploadTitle", "uploadText"]),
    watch: {
        uploadPromise(val) {
            if (val) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "auto";
        },
    },
    methods: {
        handleBackdropClick() {
            this.uploadPromise(false);
            this.$store.dispatch("closeUploadPopUp");
        },
    },
};
</script>
