<template>
    <inline-svg
        :style="{ height: `${size}px`, width: `${size}px` }"
        :src="require(`../../assets/icons/${svg}.svg`)"
        class="stroke-current"
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Icon extends Vue {
    @Prop(String) readonly svg!: string;
    @Prop(Number) readonly size!: number;
}
</script>
