<template>
    <div class="bg-white dark:bg-gray-800 z-10 sticky top-0 pt-4">
        <upload-pop-up />
        <txt-input-pop-up />
        <div
            class="flex px-4 py-3 border-2 rounded-t-lg transition-all"
            :class="toolbarClass"
        >
            <!-- Bold -->
            <icon-button
                svg="bold"
                class="mr-3"
                :icon-size="22"
                :class="{ 'opacity-60': editor.isActive('bold') }"
                :on-click="() => editor.chain().focus().toggleBold().run()"
            />

            <!-- Italic -->
            <icon-button
                svg="italic"
                class="mr-3"
                :icon-size="22"
                :class="{ 'opacity-60': editor.isActive('italic') }"
                :on-click="() => editor.chain().focus().toggleItalic().run()"
            />

            <!-- Underline -->
            <icon-button
                svg="underline"
                class="mr-3"
                :icon-size="22"
                :class="{ 'opacity-60': editor.isActive('underline') }"
                :on-click="() => editor.chain().focus().toggleUnderline().run()"
            />

            <!-- Ordered list -->
            <icon-button
                svg="ol"
                class="mr-3"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('ordered_list'),
                }"
                :on-click="
                    () => editor.chain().focus().toggleOrderedList().run()
                "
            />

            <!-- Bullet list -->
            <icon-button
                svg="ul"
                class="mr-3"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('bullet_list'),
                }"
                :on-click="
                    () => editor.chain().focus().toggleBulletList().run()
                "
            />

            <!-- Check list -->
            <icon-button
                svg="check-square"
                class="mr-3"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('taskList'),
                }"
                :on-click="() => editor.chain().focus().toggleTaskList().run()"
            />

            <!-- Divider -->
            <icon-button
                svg="horizontal-rule"
                class="mr-3"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('horizontalRule'),
                }"
                :on-click="
                    () => editor.chain().focus().setHorizontalRule().run()
                "
            />

            <!-- Link -->
            <icon-button
                svg="link"
                class="mr-3"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('link'),
                }"
                :on-click="
                    () => {
                        if (editor.isActive('link'))
                            return editor.chain().focus().unsetLink().run();

                        $store.dispatch('openTxtInputPopUp', {
                            title: 'Enter URL link',
                            text: 'Make sure to include the https://',
                            label: 'Link',
                            placeholder: 'Link',
                        });
                    }
                "
            />

            <!-- Image -->
            <icon-button
                svg="image"
                class="mr-3"
                :icon-size="22"
                :on-click="
                    () => {
                        $store.dispatch('openUploadPopUp', {
                            title: 'Upload image',
                            text: 'Please make sure that it\'s less than 1MB.',
                        });
                    }
                "
            />

            <!-- Templates -->
            <icon-button
                v-if="templates"
                svg="file-text"
                class="mr-3"
                :icon-size="22"
                :on-click="
                    () => {
                        $store.commit('SET_DATA', {
                            attr: 'editor',
                            data: editor,
                        });
                        $store.dispatch('openModal', {
                            name: 'templates',
                        });
                    }
                "
            />

            <!-- Undo -->
            <icon-button
                svg="rotate-ccw"
                class="mr-3"
                :icon-size="22"
                :on-click="() => editor.chain().focus().undo().run()"
            />

            <!-- Redo -->
            <icon-button
                svg="rotate-cw"
                :icon-size="22"
                :on-click="() => editor.chain().focus().redo().run()"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Compressor from "compressorjs";

const UploadPopUp = () =>
    import(
        /* webpackChunkName: "components.uploadPopUp", webpackPrefetch: true  */ "@/components/generic/UploadPopUp"
    );
const TxtInputPopUp = () =>
    import(
        /* webpackChunkName: "components.txtInputPopUp", webpackPrefetch: true  */ "@/components/generic/TxtInputPopUp"
    );

export default {
    components: {
        UploadPopUp,
        TxtInputPopUp,
    },
    props: {
        toolbarClass: String,
    },
    computed: mapState(["editor", "templates", "cloudinaryImages", "newImgs"]),
    methods: {
        /**
         * Sets the link of the selected text.
         */
        handleReturnInput(link) {
            this.editor.chain().focus().setLink({ href: link }).run();
        },

        /**
         * Adds an image.
         */
        handleImageSelect() {
            const FILE = document.getElementById("img-uploader").files[0];
            const READER = new FileReader();
            READER.addEventListener(
                "load",
                () => {
                    this.$axios
                        .post("/.netlify/functions/upload-image", {
                            file: READER.result.toString(),
                        })
                        .then((response) => {
                            this.editor
                                .chain()
                                .focus()
                                .setImage({
                                    src: response.data.url,
                                    loading: "lazy",
                                })
                                .run();
                            this.$store.commit("SET_DATA", {
                                attr: "cloudinaryImages",
                                data: {
                                    startingWith: [
                                        ...this.cloudinaryImages.startingWith,
                                        response.data.url,
                                    ],
                                    endingWith: [
                                        ...this.cloudinaryImages.endingWith,
                                        response.data.url,
                                    ],
                                },
                            });
                            this.$store.commit("SET_DATA", {
                                attr: "newImgs",
                                data: [...this.newImgs, response.data.url],
                            });
                        });
                },
                false
            );

            if (FILE) {
                if (FILE.size < 1100000) {
                    // eslint-disable-next-line
                    new Compressor(FILE, {
                        quality: 0.6,
                        success(result) {
                            READER.readAsDataURL(result);
                        },
                        error(err) {
                            console.error(err.message);
                        },
                    });
                } else {
                    this.$store.dispatch("openResponsePopUp", {
                        title: "File size is too big",
                        description: "Please compress it to 1MB or lower",
                        persist: true,
                        backdrop: true,
                    });
                    document.getElementById("img-uploader").value = "";
                }
            }
        },
    },
};
</script>
