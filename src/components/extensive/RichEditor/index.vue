<style lang="scss">
div#rich_editor div[contenteditable],
div#rich_show_content {
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
        border-radius: 10px;
        max-width: 40%;
        margin: 1rem 0;
    }
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
    .ProseMirror {
        outline: none;
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
[data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #888888;
    font-style: italic;
}
</style>

<template>
    <div class="mt-4">
        <!-- Preview -->
        <div
            v-if="!editState && !test_empty_html(value)"
            id="rich_show_content"
            class="flex justify-between relative p-4 border-2 border-gray-200: dark:border-white rounded-lg transition-opacity"
            :class="
                !!editor
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer hover:opacity-60'
            "
            @click="
                () => {
                    if (editor) return;
                    editState = true;
                    $emit('on-edit-change', 'edit', itemId);
                }
            "
        >
            <div v-html="updateHTML(value, true)" class="mr-4" />
            <icon svg="edit-2" :icon-size="24" class="absolute top-2 right-2" />
        </div>

        <!-- Editor -->
        <div v-else-if="editState">
            <tool-bar
                :toolbar-class="
                    caretInEditor
                        ? 'border-gray-800 dark:border-white'
                        : 'border-gray-200 dark:border-white'
                "
            />
            <editor-content
                id="rich_editor"
                class="border-2 border-t-0 rounded-b-lg p-4 transition-all"
                :editor="editor"
                :class="
                    caretInEditor
                        ? 'border-gray-800 dark:border-white'
                        : 'border-gray-200 dark:border-white'
                "
            />
        </div>

        <!-- Empty Placeholder -->
        <div
            v-else
            class="flex justify-between relative p-4 border-2 border-gray-200 dark:border-white rounded-lg transition-opacity"
            :class="
                !!editor
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer hover:opacity-60'
            "
            @click="
                () => {
                    if (editor) return;
                    editState = true;
                    $emit('on-edit-change', 'edit', itemId);
                }
            "
        >
            <txt class="mr-4">
                {{ emptyPlaceholder }}
            </txt>
            <icon svg="edit-2" :icon-size="24" class="absolute top-2 right-2" />
        </div>

        <!-- Button options for editing -->
        <div v-if="editState" class="grid grid-cols-2 gap-4 mt-4">
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
import { Editor, EditorContent } from "@tiptap/vue-2";
import { defaultExtensions } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import LazyImage from "../../js/LazyImage";
import { mapState } from "vuex";

const ToolBar = () =>
    import(
        /* webpackChunkName: "components.toolBar", webpackPreload: true  */ "./components/ToolBar"
    );

export default {
    components: {
        EditorContent,
        ToolBar,
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
            editState: false,
            caretInEditor: false,
            saving: false,
        };
    },
    computed: mapState(["editor", "cloudinaryImages", "newImgs"]),
    watch: {
        editState() {
            if (this.editState) {
                this.initialValue = this.value;
                const editor = new Editor({
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
                        this.$store.commit("setDataDeep", {
                            attrParent: "cloudinaryImages",
                            attrChild: "endingWith",
                            data: this.imgFinder(this.value),
                        });
                        this.$emit("input", this.editor.getHTML());
                    },
                    onFocus: () => {
                        this.caretInEditor = true;
                        this.showAddTemplate = false;
                        this.willBodyScroll(true);
                    },
                    onBlur: () => {
                        this.$store.commit("setDataDeep", {
                            attrParent: "cloudinaryImages",
                            attrChild: "endingWith",
                            data: this.imgFinder(this.value),
                        });
                        this.caretInEditor = false;
                    },
                    onDestroy: async () => {
                        if (!this.saving) {
                            await this.cancelledRemoveNewImgs();
                            this.$store.commit("setDataDeep", {
                                attrParent: "cloudinaryImages",
                                attrChild: "endingWith",
                                data: this.cloudinaryImages.startingWith,
                            });
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
                        this.$store.commit("setData", {
                            attr: "cloudinaryImages",
                            data: {
                                startingWith: [],
                                endingWith: [],
                            },
                        });
                        this.$store.commit("setData", {
                            attr: "newImgs",
                            data: [],
                        });
                    },
                });

                this.$store.commit("setData", {
                    attr: "editor",
                    data: editor,
                });

                const FOUND_IMGS = this.imgFinder(this.value);
                this.$store.commit("setData", {
                    attr: "cloudinaryImages",
                    data: {
                        startingWith: FOUND_IMGS,
                        endingWith: FOUND_IMGS,
                    },
                });
            } else {
                this.editor.destroy();
                this.$store.commit("setData", {
                    attr: "editor",
                    data: undefined,
                });
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
        /**
         * Finds all the images in the html.
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
                                    this.$store.commit("setData", {
                                        attr: "cloudinaryImages",
                                        data: {
                                            startingWith: [
                                                ...this.cloudinaryImages
                                                    .startingWith,
                                                response.data.url,
                                            ],
                                            endingWith: [
                                                ...this.cloudinaryImages
                                                    .endingWith,
                                                response.data.url,
                                            ],
                                        },
                                    });
                                    this.$store.commit("setData", {
                                        attr: "newImgs",
                                        data: [
                                            ...this.newImgs,
                                            response.data.url,
                                        ],
                                    });
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

        /**
         * Removes images uploaded on cancel
         */
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
