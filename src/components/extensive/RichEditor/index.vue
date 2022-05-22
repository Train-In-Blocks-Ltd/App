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
    a {
        text-decoration: underline;
        cursor: pointer;
        &:hover {
            opacity: 0.6;
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
            <icon svg="edit-2" :size="24" class="absolute top-2 right-2" />
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
                {{ placeholder }}
            </txt>
            <icon svg="edit-2" :size="24" class="absolute top-2 right-2" />
        </div>

        <!-- Button options for editing -->
        <div v-if="editState" class="grid grid-cols-2 gap-4 mt-4">
            <default-button
                :on-click="
                    () => {
                        saving = true;
                        editState = false;
                        $emit('on-edit-change', 'save', itemId);
                    }
                "
                aria-label="Save"
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
                    }
                "
                aria-label="Cancel"
            >
                Cancel
            </default-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { Editor, EditorContent } from "@tiptap/vue-2";
import { defaultExtensions } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import LazyImage from "../../js/LazyImage";
import utilsStore from "../../../store/modules/utils";
import { baseAPI } from "../../../api";
import GeneralMixins from "../../../generalMixins";

const ToolBar = () =>
    import(
        /* webpackChunkName: "components.toolBar", webpackPreload: true  */ "./components/ToolBar.vue"
    );

@Component({
    components: {
        EditorContent,
        ToolBar,
    },
})
export default class RichEditor extends Mixins(GeneralMixins) {
    @Prop([Number, String]) readonly itemId!: number | string;
    @Prop([Number, String]) readonly editing!: number | string;
    @Prop(String) readonly value!: string;
    @Prop(String) readonly placeholder!: string;
    @Prop(Number) readonly forceStop!: number;

    editState: boolean = false;
    caretInEditor: boolean = false;
    saving: boolean = false;

    get editor() {
        return utilsStore.editor;
    }
    get newImgs() {
        return utilsStore.newImgs;
    }

    @Watch("editState")
    onEditChange() {
        if (this.editState) {
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
                    this.$emit("input", this.editor?.getHTML());
                },
                onFocus: () => {
                    this.caretInEditor = true;
                },
                onBlur: () => {
                    this.caretInEditor = false;
                },
                onDestroy: async () => {
                    if (!this.saving) await this.cancelledRemoveNewImgs();
                    utilsStore.setEditor(null);
                    utilsStore.setNewImgs([]);
                },
            });

            utilsStore.setEditor(editor);
        } else {
            this.editor?.destroy();
            utilsStore.setEditor(null);
        }
    }
    @Watch("forceStop")
    onForceStop() {
        if (this.editing !== this.itemId) {
            this.editState = false;
        }
    }

    beforeDestroy() {
        if (this.editor) this.editor.destroy();
    }

    /** Removes images uploaded on cancel. */
    cancelledRemoveNewImgs() {
        if (this.newImgs) {
            this.newImgs.forEach(async (url) => {
                await baseAPI.post("/.netlify/functions/delete-image", {
                    file: url,
                });
            });
        }
    }

    /** Tests injected html to see if it's empty. */
    test_empty_html(text?: string) {
        if (!text) return true;
        const REMOVE_TAGS_AND_SPACE = text
            .replace(/<[^>]*>?/gm, "")
            .replace(/&nbsp;/g, "")
            .replace(/ /g, "");
        if (REMOVE_TAGS_AND_SPACE === "") {
            return true;
        } else {
            return false;
        }
    }
}
</script>
