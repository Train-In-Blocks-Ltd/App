<template>
    <div class="bg-white dark:bg-gray-800 z-10 sticky top-0 pt-4">
        <div
            class="flex flex-wrap px-4 pt-4 border-2 rounded-t-lg transition-all"
            :class="toolbarClass"
        >
            <!-- Bold -->
            <icon-button
                svg="bold"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{ 'opacity-60': editor.isActive('bold') }"
                :on-click="() => editor.chain().focus().toggleBold().run()"
                aria-label="Bold"
                title="Bold"
            />

            <!-- Italic -->
            <icon-button
                svg="italic"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{ 'opacity-60': editor.isActive('italic') }"
                :on-click="() => editor.chain().focus().toggleItalic().run()"
                aria-label="Italic"
                title="Italic"
            />

            <!-- Underline -->
            <icon-button
                svg="underline"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{ 'opacity-60': editor.isActive('underline') }"
                :on-click="() => editor.chain().focus().toggleUnderline().run()"
                aria-label="Underline"
                title="Underline"
            />

            <!-- Ordered list -->
            <icon-button
                svg="ol"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('ordered_list'),
                }"
                :on-click="
                    () => editor.chain().focus().toggleOrderedList().run()
                "
                aria-label="Ordered list"
                title="Ordered list"
            />

            <!-- Bullet list -->
            <icon-button
                svg="ul"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('bullet_list'),
                }"
                :on-click="
                    () => editor.chain().focus().toggleBulletList().run()
                "
                aria-label="Bullet list"
                title="Bullet list"
            />

            <!-- Check list -->
            <icon-button
                svg="check-square"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('taskList'),
                }"
                :on-click="() => editor.chain().focus().toggleTaskList().run()"
                aria-label="Check list"
                title="Check list"
            />

            <!-- Divider -->
            <icon-button
                svg="horizontal-rule"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('horizontalRule'),
                }"
                :on-click="
                    () => editor.chain().focus().setHorizontalRule().run()
                "
                aria-label="Divider"
                title="Divider"
            />

            <!-- Link -->
            <icon-button
                svg="link"
                class="mr-3 mb-4"
                :icon-size="22"
                :class="{
                    'opacity-60': editor.isActive('link'),
                }"
                :on-click="handleOpenLinkBuilder"
                aria-label="Link"
                title="Link"
            />

            <!-- Image -->
            <icon-button
                svg="image"
                class="mr-3 mb-4"
                :icon-size="22"
                :on-click="handleOpenUpload"
                aria-label="Image"
                title="Image"
            />

            <!-- Templates -->
            <icon-button
                v-if="templates"
                svg="file-text"
                class="mr-3 mb-4"
                :icon-size="22"
                :on-click="handleOpenTemplates"
                aria-label="Templates"
                title="Templates"
            />

            <!-- Undo -->
            <icon-button
                svg="rotate-ccw"
                class="mr-3 mb-4"
                :icon-size="22"
                :on-click="() => editor.chain().focus().undo().run()"
                aria-label="Undo"
                title="Undo"
            />

            <!-- Redo -->
            <icon-button
                svg="rotate-cw"
                class="mb-4"
                :icon-size="22"
                :on-click="() => editor.chain().focus().redo().run()"
                aria-label="Redo"
                title="redo"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import templatesStore from "../../../../store/modules/templates";
import utilsStore from "../../../../store/modules/utils";
import { ChainedCommands } from "@tiptap/core";

@Component
export default class ToolBar extends Vue {
    @Prop(String) readonly toolbarClass!: string;

    get editor() {
        return utilsStore.editor;
    }
    get templates() {
        return templatesStore.templates;
    }
    get newImgs() {
        return utilsStore.newImgs;
    }

    /** Opens templates selector. */
    handleOpenTemplates() {
        utilsStore.openModal({
            name: "templates",
        });
    }

    /** Opens link builder. */
    handleOpenLinkBuilder() {
        if (this.editor?.isActive("link"))
            return this.editor?.chain().focus().unsetLink().run();

        utilsStore.txtInputPopUpRef?.open({
            title: "Enter URL link",
            text: "Make sure to include the https://",
            label: "Link",
            placeholder: "Link",
            onSuccess: (link: string) => {
                this.editor?.chain().focus().setLink({ href: link }).run();
            },
        });
    }

    /** Opens image picker. */
    handleOpenUpload() {
        utilsStore.uploadPopUpRef?.open({
            title: "Upload image",
            text: "Please make sure that it's less than 1MB.",
            onSuccess: (response) => {
                (
                    this.editor?.chain().focus() as ChainedCommands & {
                        setImage: any;
                    }
                )
                    .setImage({
                        src: response.data.url,
                        loading: "lazy",
                    })
                    .run();
                utilsStore.setNewImgs([...this.newImgs, response.data.url]);
            },
        });
    }
}
</script>
