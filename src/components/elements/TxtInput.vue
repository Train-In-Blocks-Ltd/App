<template>
    <div class="h-fit w-auto cursor-pointer self-center">
        <label v-if="label" :for="name" :class="labelClass">
            {{ label }}
        </label>
        <input
            class="w-full px-2 py-3 font-sans outline-none bg-transparent text-gray-800 dark:text-white border-2 border-gray-400 dark:border-gray-400 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all"
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

<script>
export default {
    props: {
        name: String,
        inputId: String,
        inputRef: String,
        label: String,
        info: String,
        error: String,
        value: [String, Number],
        inputClass: String,
        labelClass: String,
        infoClass: String,
        errorClass: String,
        type: String,
        rel: String,
        inputmode: String,
        autocomplete: String,
        placeholder: String,
        ariaLabel: String,
        pattern: String,
        onInput: Function,
        onBlur: Function,
        required: Boolean,
        focusFirst: Boolean,
        min: [String, Number],
        max: [String, Number],
        minLength: [String, Number],
        maxLength: [String, Number],
    },
    mounted() {
        if (this.focusFirst) this.$el.children[0].focus();
    },
    methods: {
        handleInput(e) {
            if (this.onInput) this.onInput();
            this.$emit("output", e.target.value);
        },
    },
};
</script>
