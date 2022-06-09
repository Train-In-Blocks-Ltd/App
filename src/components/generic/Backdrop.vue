<template>
    <div
        class="fixed top-0 left-0 w-screen min-h-screen bg-black opacity-40 z-30"
        @click="
            () => {
                if (onClick) onClick();
            }
        "
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Backdrop extends Vue {
    @Prop(Function) readonly onClick!: () => void;
}
</script>
