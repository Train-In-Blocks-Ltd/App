<template>
    <div class="h-fit w-auto cursor-pointer self-center">
        <label v-if="label" :for="name" :class="labelClass">
            {{ label }}
        </label>
        <div
            class="relative px-2 py-3 mt-1 border-2 border-gray-400 dark:border-gray-400 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all"
        >
            <icon
                svg="chevron-down"
                :size="24"
                class="absolute right-2 top-3"
                style="z-index: -1"
            />
            <select
                :id="inputId"
                :name="name"
                :value="value"
                :class="inputClass"
                :placeholder="placeholder"
                :aria-label="ariaLabel"
                :required="required"
                @change="handleChange"
                class="appearance-none w-full font-sans outline-none text-base bg-transparent text-gray-800 dark:text-white cursor-pointer"
            >
                <option
                    v-for="(item, index) in items"
                    :key="`option-${index}`"
                    :value="item.value"
                    class="bg-white dark:bg-gray-800"
                >
                    <txt>{{ item.label }}</txt>
                </option>
            </select>
        </div>
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
import { DropdownItem } from "../../common/types";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Dropdown extends Vue {
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
    @Prop(Boolean) readonly required!: boolean;
    @Prop(Boolean) readonly focusFirst!: boolean;
    @Prop(Array) readonly items!: DropdownItem[];

    mounted() {
        // @ts-expect-error
        if (this.focusFirst) this.$el.children[0].focus();
    }

    handleChange(e: any) {
        if (this.onInput) this.onInput();
        this.$emit("output", e.target.value);
    }
}
</script>
