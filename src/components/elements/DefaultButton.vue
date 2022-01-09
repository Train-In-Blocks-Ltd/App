<template>
    <button
        v-if="onClickPrevent"
        :class="theme === 'red' && 'bg-red-700'"
        :disabled="isDisabled"
        class="select-none cursor-pointer self-center rounded border-none px-6 py-3 font-bold text-white dark:text-gray-800 bg-gray-800 dark:bg-white transition-all hover:opacity-60 active:scale-95 disabled:opacity-60 disabled:cursor-default"
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
        :class="theme === 'red' && 'bg-red-700'"
        :disabled="isDisabled"
        :type="submit ? 'submit' : ''"
        class="select-none cursor-pointer self-center rounded border-none px-6 py-3 font-bold text-white dark:text-gray-800 bg-gray-800 dark:bg-white transition-all hover:opacity-60 active:scale-95 disabled:opacity-60 disabled:cursor-default"
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
        submit: Boolean,
    },
});
</script>
