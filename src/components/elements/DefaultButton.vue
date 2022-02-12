<template>
    <button
        v-if="prevent"
        :class="[
            isDisabled ? 'cursor-default opacity-60' : 'cursor-pointer',
            {
                'bg-red-700': theme === 'red',
                'bg-green-700': theme === 'green',
                'dark:text-gray-800 dark:bg-white': !['red', 'green'].includes(
                    theme
                ),
            },
        ]"
        :disabled="isDisabled"
        class="select-none cursor-pointer self-center rounded border-none px-6 py-3 font-bold text-white bg-gray-800 transition-all hover:opacity-60"
        @click.prevent="
            () => {
                if (onClickPrevent) onClickPrevent();
            }
        "
    >
        <slot />
    </button>
    <button
        v-else
        :class="[
            isDisabled ? 'cursor-default opacity-60' : 'cursor-pointer',
            {
                'bg-red-700': theme === 'red',
                'bg-green-700': theme === 'green',
                'dark:text-gray-800 dark:bg-white': !['red', 'green'].includes(
                    theme
                ),
            },
        ]"
        :disabled="isDisabled"
        class="select-none self-center rounded border-none px-6 py-3 font-bold text-white bg-gray-800 transition-all hover:opacity-60"
        @click="
            () => {
                if (onClick) onClick();
            }
        "
    >
        <slot />
    </button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        theme: {
            type: String,
            default: "normal",
        },
        onClick: {
            type: [Function, Promise],
            default: () => {},
        },
        onClickPrevent: {
            type: [Function, Promise],
            default: () => {},
        },
        isDisabled: Boolean,
        prevent: Boolean,
    },
});
</script>
