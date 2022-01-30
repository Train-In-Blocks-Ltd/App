<template>
    <div class="flex">
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
            :on-click="() => editor.chain().focus().toggleItalic().run()"
        />

        <!-- Underline -->
        <icon-button
            svg="underline"
            class="mr-2"
            :icon-size="22"
            :class="{ 'opacity-60': editor.isActive('underline') }"
            :on-click="() => editor.chain().focus().toggleUnderline().run()"
        />

        <!-- Ordered list -->
        <icon-button
            svg="ol"
            class="mr-2"
            :icon-size="22"
            :class="{
                'opacity-60': editor.isActive('ordered_list'),
            }"
            :on-click="() => editor.chain().focus().toggleOrderedList().run()"
        />

        <!-- Bullet list -->
        <icon-button
            svg="ul"
            class="mr-2"
            :icon-size="22"
            :class="{
                'opacity-60': editor.isActive('bullet_list'),
            }"
            :on-click="() => editor.chain().focus().toggleBulletList().run()"
        />

        <!-- Check list -->
        <icon-button
            svg="check-square"
            class="mr-2"
            :icon-size="22"
            :class="{
                'opacity-60': editor.isActive('taskList'),
            }"
            :on-click="() => editor.chain().focus().toggleTaskList().run()"
        />

        <!-- Divider -->
        <icon-button
            svg="horizontal-rule"
            class="mr-2"
            :icon-size="22"
            :class="{
                'opacity-60': editor.isActive('horizontalRule'),
            }"
            :on-click="() => editor.chain().focus().setHorizontalRule().run()"
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
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["editor", "templates"]),
};
</script>
