<template>
    <h1
        v-if="type === 'title' && isMain"
        :class="{ 'text-gray-600 dark:text-gray-300': grey }"
        class="text-4xl dark:text-white font-bold"
    >
        <slot />
    </h1>
    <h2
        v-else-if="type === 'title'"
        :class="{ 'text-gray-600 dark:text-gray-300': grey }"
        class="text-4xl dark:text-white font-bold"
    >
        <slot />
    </h2>
    <h3
        v-else-if="type === 'subtitle'"
        :class="{ 'text-gray-600 dark:text-gray-300': grey }"
        class="text-3xl dark:text-white font-bold"
    >
        <slot />
    </h3>
    <p
        v-else-if="type === 'tiny'"
        class="text-sm dark:text-white"
        :class="{ 'text-gray-600 dark:text-gray-300': grey, 'font-bold': bold }"
    >
        <slot />
    </p>
    <p
        v-else-if="type === 'large-body'"
        class="text-2xl dark:text-white"
        :class="{ 'text-gray-600 dark:text-gray-300': grey, 'font-bold': bold }"
    >
        <slot />
    </p>
    <p
        v-else
        class="dark:text-white"
        :class="{ 'text-gray-600 dark:text-gray-300': grey, 'font-bold': bold }"
    >
        <slot />
    </p>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "body",
        },
        isMain: Boolean,
        grey: Boolean,
        bold: Boolean,
    },
};
</script>
