<style lang="scss">
/* Editor */
@mixin todo-list {
    ul[data-type="taskList"] {
        list-style: none;
        padding: 0;
        li {
            display: flex;
            align-items: center;
            label {
                flex: 0 0 auto;
                margin-right: 0.5rem;
            }
        }
    }
}
@mixin editor-main {
    cursor: pointer;
    padding: 1rem;
    border: 2px solid var(--base_faint);
    border-radius: 10px;
    margin-top: 1rem;
    transition: 0.6s opacity cubic-bezier(0.165, 0.84, 0.44, 1),
        0.6s border cubic-bezier(0.165, 0.84, 0.44, 1);
    &:hover {
        border: 2px solid var(--base_light);
        opacity: var(--light_opacity);
    }
}
.placeholder {
    @include editor-main;

    outline: none;
}
div#rich_show_content {
    @include todo-list;
    @include editor-main;

    display: grid;
    grid-template-columns: 1fr 24px;
    > div:first-child > div,
    > div:first-child > p {
        margin: 0.6rem 0;
        outline: none;
        appearance: none;
    }
    iframe {
        display: none;
    }
    img {
        cursor: pointer;
        border-radius: 10px;
        max-width: 40%;
        margin: 1rem 0;
        transition: 0.4s all cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    a {
        color: var(--link);
    }
    .ProseMirror {
        outline: none;
    }
}
button.menu_button:focus {
    box-shadow: none;
}
div#rich_editor {
    @include todo-list;
    div[contenteditable] {
        outline: none;
        appearance: none;
        > div,
        > p {
            margin: 0.6rem 0;
        }
        iframe {
            display: none;
        }
        img {
            cursor: pointer;
            border-radius: 10px;
            max-width: 40%;
            margin: 1rem 0;
            transition: 0.4s all cubic-bezier(0.165, 0.84, 0.44, 1);
            &:hover {
                opacity: var(--light_opacity);
            }
        }
        a {
            color: var(--link);
        }
    }
}
svg.edit_icon {
    &.placeholder_icon {
        float: right;
    }
    path {
        stroke: var(--base_light);
        transition: var(--transition_standard);
    }
}

/* Responsive */
@media (max-width: 768px) {
    div#rich_editor > div[contenteditable] img,
    div#rich_show_content img {
        max-width: 100%;
    }
}
@media (max-width: 768px) {
    div#rich_show_content img,
    div#rich_show_content iframe {
        max-width: 100%;
    }
}
</style>

<style lang="scss" scoped>
// -----------------------------
// Menu and placeholder
// -----------------------------

/* Attr */
[data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #888888;
    font-style: italic;
}

/* Outer container of menu */
.menu_bar_wrapper {
    z-index: 1;
    position: sticky;
    top: 0;
    padding-top: 1rem;

    /* Inner container of menu */
    #menu_bar {
        border: 2px solid var(--base_faint);
        border-radius: 10px 10px 0 0;
        padding: 0 1rem;
        transition: var(--transition_standard);
        &.editorFocused {
            border: 2px solid var(--base);
        }
        button {
            padding: 0;
            margin: 0.8rem 1rem 0.6rem 0;
            color: var(--base);
            background-color: transparent;
        }
        svg {
            height: 20px;
            width: 20px;
        }
    }
}

// -----------------------------
// Templates
// -----------------------------
.template_menu {
    display: grid;
    grid-gap: 1rem;
    #templates_search_none {
        display: none;
    }
    h3 {
        margin-top: 1rem;
    }
    .templates_container {
        display: grid;
        grid-gap: 1rem;
        .template_item {
            display: grid;
            grid-template-columns: 0.5fr 1fr;
            grid-gap: 2rem;
            button {
                width: fit-content;
            }
            svg {
                margin: auto 0 auto 0.6rem;
            }
            .preview_html {
                max-height: 400px;
                font-size: 0.8rem;
                padding: 1rem;
                background-color: var(--fore);
                border: 2px solid var(--base);
                border-radius: 5px;
                overflow-y: auto;
                &::-webkit-scrollbar {
                    width: 3px;
                }
            }
        }
    }
}

// -----------------------------
// Editor
// -----------------------------
div#rich_editor {
    padding: 1rem;
    outline-width: 0;
    border: 2px solid var(--base_faint);
    border-top: none;
    border-radius: 0 0 10px 10px;
    transition: var(--transition_standard);
    &.editorFocused {
        border: 2px solid var(--base);
        border-top: none;
    }
}
.bottom_bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.6rem;
    margin-top: 1rem;
    z-index: 1;
}

/* Responsive */
@media (max-width: 992px) {
    .template_menu {
        .templates_container {
            grid-gap: 3rem;
            .template_item {
                display: flex;
                flex-direction: column-reverse;
                grid-gap: 0.6rem;
                button {
                    width: 100%;
                }
            }
        }
    }
}
</style>

<template>
    <div>
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
            <input-pop-up ref="input_pop_up" />
        </transition>

        <!-- Preview -->
        <div
            v-if="!editState && !test_empty_html(value)"
            id="rich_show_content"
            class="fadeIn"
            @click="(editState = true), $emit('on-edit-change', 'edit', itemId)"
        >
            <div v-html="updateHTML(value, true)" />
            <icon svg="edit-2" :icon-size="28" />
        </div>

        <div v-else-if="editState">
            <!-- Toolbar -->
            <div class="flex" :class="{ editorFocused: caretInEditor }">
                <!-- Bold -->
                <icon-button
                    svg="bold"
                    class="mr-2"
                    :icon-size="22"
                    :class="{ 'opacity-60': editor.isActive('bold') }"
                    :on-click="() => editor.chain().focus().toggleBold().run()"
                />

                <!-- Italic -->
                <icon-button
                    svg="italic"
                    class="mr-2"
                    :icon-size="22"
                    :class="{ 'opacity-60': editor.isActive('italic') }"
                    :on-click="
                        () => editor.chain().focus().toggleItalic().run()
                    "
                />

                <!-- Underline -->
                <icon-button
                    svg="underline"
                    class="mr-2"
                    :icon-size="22"
                    :class="{ 'opacity-60': editor.isActive('underline') }"
                    :on-click="
                        () => editor.chain().focus().toggleUnderline().run()
                    "
                />

                <!-- Ordered list -->
                <icon-button
                    svg="ol"
                    class="mr-2"
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
                    class="mr-2"
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
                    class="mr-2"
                    :icon-size="22"
                    :class="{
                        'opacity-60': editor.isActive('taskList'),
                    }"
                    :on-click="
                        () => editor.chain().focus().toggleTaskList().run()
                    "
                />

                <!-- Divider -->
                <icon-button
                    svg="horizontal-rule"
                    class="mr-2"
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
                    class="mr-2"
                    :icon-size="22"
                    :class="{
                        'opacity-60': editor.isActive('link'),
                    }"
                    :on-click="
                        () =>
                            editor.isActive('link')
                                ? editor.chain().focus().unsetLink().run()
                                : setLinkUrl()
                    "
                />

                <!-- Image -->
                <icon-button
                    svg="image"
                    class="mr-2"
                    :icon-size="22"
                    :on-click="() => null"
                />

                <!-- Templates -->
                <icon-button
                    v-if="templates"
                    svg="file-text"
                    class="mr-2"
                    :icon-size="22"
                    :on-click="
                        () => {
                            $store.commit('setData', {
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
                    class="mr-2"
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
            <editor-content
                id="rich_editor"
                :editor="editor"
                :class="{ editorFocused: caretInEditor }"
            />
        </div>

        <!-- Placeholder -->
        <p
            v-else
            class="placeholder grey fadeIn"
            @click="(editState = true), $emit('on-edit-change', 'edit', itemId)"
        >
            {{ emptyPlaceholder }}
            <icon svg="edit-2" :icon-size="28" />
        </p>

        <!-- Button options for editing -->
        <div v-if="editState" class="bottom_bar fadeIn">
            <default-button
                :on-click="
                    () => {
                        saving = true;
                        editState = false;
                        $emit('on-edit-change', 'save', itemId);
                        willBodyScroll(true);
                    }
                "
            >
                Save
            </default-button>
            <default-button
                theme="red"
                :on-click="
                    () => {
                        saving = false;
                        editState = false;
                        $emit('on-edit-change', 'cancel', itemId);
                        willBodyScroll(true);
                    }
                "
            >
                Cancel
            </default-button>
        </div>
    </div>
</template>

<script>
import Compressor from "compressorjs";
import { Editor, EditorContent } from "@tiptap/vue-2";
import { defaultExtensions } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import LazyImage from "../../js/LazyImage";

export default {
    components: {
        EditorContent,
    },
    props: {
        itemId: [Number, String],
        weekId: Number,
        editing: [Number, String],
        value: String,
        emptyPlaceholder: String,
        forceStop: Number,
        templates: Boolean,
    },
    data() {
        return {
            // Editor
            initialValue: null,
            editor: null,
            editState: false,
            caretInEditor: false,
            cloudinaryImages: {
                startingWith: [],
                endingWith: [],
            },
            newImgs: [],
            saving: false,

            // Link
            linkUrl: null,
            linkMenuIsActive: false,
        };
    },
    watch: {
        showAddTemplate() {
            if (this.showAddTemplate) {
                this.willBodyScroll(false);
            } else {
                this.willBodyScroll(true);
            }
        },
        editState() {
            if (this.editState) {
                this.initialValue = this.value;
                this.editor = new Editor({
                    content: this.value,
                    extensions: [
                        ...defaultExtensions(),
                        Underline,
                        Link,
                        TaskList,
                        TaskItem,
                        LazyImage,
                    ],
                    onUpdate: () => {
                        this.cloudinaryImages.endingWith = this.imgFinder(
                            this.value
                        );
                        this.$emit("input", this.editor.getHTML());
                    },
                    onFocus: () => {
                        this.caretInEditor = true;
                        this.showAddTemplate = false;
                        this.willBodyScroll(true);
                    },
                    onBlur: () => {
                        this.cloudinaryImages.endingWith = this.imgFinder(
                            this.value
                        );
                        this.caretInEditor = false;
                    },
                    onDestroy: async () => {
                        if (!this.saving) {
                            await this.cancelledRemoveNewImgs();
                            this.cloudinaryImages.endingWith =
                                this.cloudinaryImages.startingWith;
                        }
                        this.cloudinaryImages.startingWith.forEach(
                            async (url) => {
                                if (
                                    !this.cloudinaryImages.endingWith.includes(
                                        url
                                    )
                                ) {
                                    await this.$axios.post(
                                        "/.netlify/functions/delete-image",
                                        {
                                            file: url,
                                        }
                                    );
                                }
                            }
                        );
                        this.initialValue = null;
                        this.cloudinaryImages = {
                            startingWith: [],
                            endingWith: [],
                        };
                        this.newImgs = [];
                    },
                });

                const FOUND_IMGS = this.imgFinder(this.value);
                this.cloudinaryImages.startingWith = FOUND_IMGS;
                this.cloudinaryImages.endingWith = FOUND_IMGS;
            } else {
                this.editor.destroy();
                this.editor = null;
            }
        },
        forceStop() {
            if (this.editing !== this.itemId) {
                this.editState = false;
            }
        },
    },
    beforeDestroy() {
        if (this.editor) {
            this.editor.destroy();
        }
    },
    methods: {
        // -----------------------------
        // General
        // -----------------------------

        /**
         * Finds all the images in the html.
         * @param {string} html - The html to search.
         * @returns An array of all the found ids of cloudinary images.
         */
        imgFinder(html) {
            const IMG_REGEX = /<img.*?src="(.*?)".*?>/gi;
            const RETURN_ARR = [];
            let finder;
            while ((finder = IMG_REGEX.exec(html)) !== null) {
                if (finder.index === IMG_REGEX.lastIndex) {
                    IMG_REGEX.lastIndex++;
                }
                finder.forEach(async (match, groupIndex) => {
                    if (groupIndex === 1) {
                        if (match.includes("base64")) {
                            await this.$axios
                                .post("/.netlify/functions/upload-image", {
                                    file: match,
                                })
                                .then((response) => {
                                    RETURN_ARR.push(response.data.url);
                                    this.cloudinaryImages.startingWith.push(
                                        response.data.url
                                    );
                                    this.cloudinaryImages.endingWith.push(
                                        response.data.url
                                    );
                                    this.newImgs.push(response.data.url);
                                    this.initialValue =
                                        this.initialValue.replace(
                                            `${match}"`,
                                            `${response.data.url}" loading="lazy"`
                                        );
                                    this.editor.commands.setContent(
                                        this.initialValue
                                    );
                                    this.$emit("input", this.editor.getHTML());
                                });
                        } else {
                            RETURN_ARR.push(match);
                        }
                    } else if (match.includes("base64")) {
                        const WRAPPED_REGEX = /<p>(<img.*?">).*?<\/p>/gi;
                        let wrappedFinder;
                        while (
                            (wrappedFinder = WRAPPED_REGEX.exec(
                                this.initialValue
                            )) !== null
                        ) {
                            if (
                                wrappedFinder.index === WRAPPED_REGEX.lastIndex
                            ) {
                                WRAPPED_REGEX.lastIndex++;
                            }
                            this.initialValue = this.initialValue.replace(
                                wrappedFinder[0],
                                wrappedFinder[1]
                            );
                        }
                    }
                });
            }
            return RETURN_ARR;
        },

        cancelledRemoveNewImgs() {
            if (this.newImgs) {
                this.newImgs.forEach(async (url) => {
                    await this.$axios.post("/.netlify/functions/delete-image", {
                        file: url,
                    });
                });
            }
        },

        /**
         * Adds tracked data custom node.
         */
        addTrackData() {
            this.editor.commands.insertContent(
                '<div data-type="protocol-item"></div>'
            );
        },

        /**
         * Sets the link of the selected text.
         */
        async setLinkUrl() {
            const SRC = await this.$refs.input_pop_up.show(
                "link",
                "Enter the URL link",
                "Make sure to include the https://"
            );
            if (!SRC) {
                return;
            }
            this.editor.chain().focus().setLink({ href: SRC }).run();
        },

        /**
         * Adds an image.
         */
        addImg() {
            const FILE = document.getElementById("img_uploader").files[0];
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
                            this.cloudinaryImages.startingWith.push(
                                response.data.url
                            );
                            this.cloudinaryImages.endingWith.push(
                                response.data.url
                            );
                            this.newImgs.push(response.data.url);
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
                    document.getElementById("img_uploader").value = "";
                }
            }
        },

        /**
         * Tests injected html to see if it's empty.
         */
        test_empty_html(text) {
            if (text !== null) {
                const REMOVE_TAGS_AND_SPACE = text
                    .replace(/<[^>]*>?/gm, "")
                    .replace(/&nbsp;/g, "")
                    .replace(/ /g, "");
                if (REMOVE_TAGS_AND_SPACE === "") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
    },
};
</script>
