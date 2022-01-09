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
            rows="5"
            class="w-full px-2 py-3 font-sans outline-none text-base bg-transparent text-gray-800 dark:text-white border-2 border-gray-400 dark:border-gray-200 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all"
            @input="handleInput"
        />
        <txt
            v-if="error"
            type="tiny"
            class="text-red mt-1"
            :class="errorClass"
            >{{ error }}</txt
        >
    </div>
</template>

<script>
export default {
    props: {
        inputRef: String,
        name: String,
        label: String,
        error: String,
        value: String,
        inputClass: String,
        labelClass: String,
        errorClass: String,
        type: String,
        rel: String,
        inputmode: String,
        autocomplete: String,
        placeholder: String,
        ariaLabel: String,
        pattern: String,
        onInput: Function,
        required: Boolean,
        focusFirst: Boolean,
    },
    mounted() {
        if (this.focusFirst) this.$el.children[0].focus();
    },
    methods: {
        handleInput(e) {
            this.$emit("output", e.target.value);
            if (this.onInput) this.onInput();
        },
    },
};
</script>
