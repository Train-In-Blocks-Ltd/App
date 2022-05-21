<template>
    <div class="h-fit w-auto cursor-pointer self-center">
        <label v-if="label" :for="name" :class="labelClass">
            {{ label }}
        </label>
        <input
            class="w-full px-2 py-3 mt-1 font-sans outline-none bg-transparent text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-400 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all"
            :id="inputId"
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
            :min="min"
            :max="max"
            :minlength="minLength"
            :maxlength="maxLength"
            @input="handleInput"
            @blur="
                () => {
                    if (onBlur) onBlur();
                }
            "
        />
        <txt v-if="info" type="tiny" class="mt-1" :class="infoClass">{{
            info
        }}</txt>
        <txt
            v-if="error"
            type="tiny"
            class="text-red-700 mt-1"
            :class="errorClass"
            >{{ error }}</txt
        >
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TxtInput extends Vue {
    @Prop(String) readonly name!: string;
    @Prop(String) readonly inputId!: string;
    @Prop(String) readonly inputRef!: string;
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
    @Prop(Function) readonly onBlur!: () => void;
    @Prop(Boolean) readonly required!: boolean;
    @Prop(Boolean) readonly focusFirst!: boolean;
    @Prop([String, Number]) readonly min!: string | number;
    @Prop([String, Number]) readonly max!: string | number;
    @Prop([String, Number]) readonly minLength!: string | number;
    @Prop([String, Number]) readonly maxLength!: string | number;

    mounted() {
        // @ts-expect-error
        if (this.focusFirst) this.$el.children[0].focus();
    }

    handleInput(e: any) {
        if (this.onInput) this.onInput();
        this.$emit("output", e.target.value);
    }
}
</script>
