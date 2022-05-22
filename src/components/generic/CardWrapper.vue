<template>
    <div
        :class="[
            {
                'hover:shadow-lg': !noHover,
                shadow: hasShadow,
                'border-3 border-gray-800 dark:border-white': !noBorder,
            },
        ]"
        class="rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-800 transition-all duration-300"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class CardWrapper extends Vue {
    @Prop(Boolean) readonly noHover!: boolean;
    @Prop(Boolean) readonly noBorder!: boolean;
    @Prop(Boolean) readonly hasShadow!: boolean;
}
</script>
