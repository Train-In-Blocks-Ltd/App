<template>
    <div class="h-fit w-auto cursor-pointer self-center">
        <label v-if="label" :for="name" :class="labelClass">
            {{ label }}
        </label>
        <input
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
            class="w-full px-2 py-3 font-sans outline-none text-base bg-transparent text-gray-800 dark:text-white border-2 border-gray-400 dark:border-gray-200 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all"
            @input="handleInput"
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
const Txt = () =>
    import(
        /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "./Txt"
    );

export default {
    components: {
        Txt,
    },
    props: {
        name: String,
        inputId: String,
        inputRef: String,
        label: String,
        info: String,
        error: String,
        value: String,
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
