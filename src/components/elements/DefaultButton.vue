<template>
    <button
        v-if="prevent"
        :class="[
            isDisabled || disableButtons
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer',
            {
                'bg-red-700': theme === 'red',
                'bg-green-700': theme === 'green',
                'dark:text-gray-800 dark:bg-white': !['red', 'green'].includes(
                    theme
                ),
            },
        ]"
        :disabled="isDisabled || disableButtons"
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
            isDisabled || disableButtons
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer',
            {
                'bg-red-700': theme === 'red',
                'bg-green-700': theme === 'green',
                'dark:text-gray-800 dark:bg-white': !['red', 'green'].includes(
                    theme
                ),
            },
        ]"
        :disabled="isDisabled || disableButtons"
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
import { mapState } from "vuex";

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
    computed: mapState(["disableButtons"]),
});
</script>
