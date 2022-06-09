<template>
    <h1
        v-if="type === 'title' && main"
        :class="{ 'text-gray-600 dark:text-gray-300': grey }"
        class="text-4xl font-bold"
    >
        <slot />
    </h1>
    <h2
        v-else-if="type === 'title'"
        :class="{ 'text-gray-600 dark:text-gray-300': grey }"
        class="text-4xl font-bold"
    >
        <slot />
    </h2>
    <h3
        v-else-if="type === 'subtitle'"
        :class="{ 'text-gray-600 dark:text-gray-300': grey }"
        class="text-3xl font-bold"
    >
        <slot />
    </h3>
    <p
        v-else-if="type === 'tiny'"
        class="text-sm"
        :class="{ 'text-gray-600 dark:text-gray-300': grey, 'font-bold': bold }"
    >
        <slot />
    </p>
    <p
        v-else-if="type === 'large-body'"
        class="text-2xl"
        :class="{ 'text-gray-600 dark:text-gray-300': grey, 'font-bold': bold }"
    >
        <slot />
    </p>
    <p
        v-else
        :class="{ 'text-gray-600 dark:text-gray-300': grey, 'font-bold': bold }"
    >
        <slot />
    </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

type TxtType =
    | "title"
    | "subtitle"
    | "tiny"
    | "large-body"
    | "body"
    | undefined;

@Component
export default class Txt extends Vue {
    @Prop(String) readonly type!: TxtType;
    @Prop(Boolean) readonly main!: boolean;
    @Prop(Boolean) readonly grey!: boolean;
    @Prop(Boolean) readonly bold!: boolean;
}
</script>
