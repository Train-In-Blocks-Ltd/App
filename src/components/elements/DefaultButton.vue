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
import { Component, Vue, Prop } from "vue-property-decorator";
import appModule from "../../store/app.module";

@Component
export default class DefaultButton extends Vue {
    @Prop(String) readonly theme!: string;
    @Prop([Function, Promise]) readonly onClick!: () => void;
    @Prop([Function, Promise]) readonly onClickPrevent!: () => void;
    @Prop(Boolean) readonly isDisabled!: boolean;
    @Prop(Boolean) readonly prevent!: boolean;

    get disableButtons() {
        return appModule.disableButtons;
    }
}
</script>
