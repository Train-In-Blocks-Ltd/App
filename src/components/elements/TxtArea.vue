<template>
    <div class="h-fit w-auto cursor-pointer self-center">
        <label v-if="label" :for="name" :class="labelClass">
            {{ label }}
        </label>
        <textarea
            :name="name"
            :value="value"
            :class="inputClass"
            :type="type"
            :inputmode="inputmode"
            :autocomplete="autocomplete"
            :placeholder="placeholder"
            :aria-label="ariaLabel"
            :pattern="pattern"
            :required="required"
            :rows="rows"
            class="w-full h-40 px-2 py-3 font-sans outline-none text-base bg-transparent text-gray-800 dark:text-white border-2 border-gray-400 dark:border-gray-400 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all"
            @input="handleInput"
        />
        <txt v-if="info" type="tiny" class="mt-1" :class="infoClass">{{
            info
        }}</txt>
        <txt
            v-if="error"
            type="tiny"
            class="text-red mt-1"
            :class="errorClass"
            >{{ error }}</txt
        >
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TxtArea extends Vue {
    @Prop(String) readonly inputRef!: string;
    @Prop(String) readonly name!: string;
    @Prop(String) readonly label!: string;
    @Prop(String) readonly info!: string;
    @Prop(String) readonly error!: string;
    @Prop(String) readonly value!: string;
    @Prop(String) readonly inputClass!: string;
    @Prop(String) readonly labelClass!: string;
    @Prop(String) readonly infoClass!: string;
    @Prop(String) readonly errorClass!: string;
    @Prop(String) readonly type!: string;
    @Prop(String) readonly rel!: string;
    @Prop(String) readonly inputmode!: string;
    @Prop(String) readonly autocomplete!: string;
    @Prop(String) readonly placeholder!: string;
    @Prop(String) readonly ariaLabel!: string;
    @Prop(String) readonly pattern!: string;
    @Prop(Function) readonly onInput!: () => void;
    @Prop(Boolean) readonly required!: boolean;
    @Prop(Boolean) readonly focusFirst!: boolean;
    @Prop([String, Number]) readonly rows!: string | number;

    mounted() {
        // @ts-expect-error
        if (this.focusFirst) this.$el.children[0].focus();
    }

    handleInput(e: any) {
        this.$emit("output", e.target.value);
        if (this.onInput) this.onInput();
    }
}
</script>
