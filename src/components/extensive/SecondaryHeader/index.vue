<template>
    <div>
        <div class="flex justify-between">
            <txt type="subtitle">{{ title }}</txt>
            <slot name="right" />
        </div>
        <slot name="under" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class SecondaryHeader extends Vue {
    @Prop(String) readonly title!: string;
}
</script>
