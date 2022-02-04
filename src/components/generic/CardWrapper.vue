<template>
    <div
        :class="[
            {
                'hover:shadow-lg': !noHover,
                shadow: hasShadow,
                'border-3 border-gray-800 dark:border-white': !noBorder,
            },
        ]"
        class="rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-800 transition-all duration-300"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        noHover: Boolean,
        noBorder: Boolean,
        hasShadow: Boolean,
    },
};
</script>
