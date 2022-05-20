<template>
    <div
        class="flex w-max items-center hover:opacity-60 transition-opacity"
        :class="disabled ? 'opacity-60' : 'cursor-pointer'"
        @click="
            () => {
                if (onClick && !disabled) onClick();
            }
        "
    >
        <inline-svg
            :class="svgClass"
            :style="{ height: `${size}px`, width: `${size}px` }"
            :src="require(`@/assets/icons/${svg}.svg`)"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class IconButton extends Vue {
    @Prop(String) readonly svg!: string;
    @Prop(String) readonly svgClass!: string;
    @Prop(Number) readonly size!: number;
    @Prop(Function) readonly onClick!: () => void;
    @Prop(Boolean) readonly disabled!: boolean;
}
</script>
