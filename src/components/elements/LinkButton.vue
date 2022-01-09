<template>
    <div
        class="px-6 py-3 bg-gray-800 dark:bg-white rounded hover:opacity-60 transition-all w-fit"
    >
        <a
            :href="link"
            :target="newTab && '_blank'"
            class="font-bold text-white dark:text-gray-800"
            ><slot
        /></a>
    </div>
</template>

<script>
export default {
    props: {
        link: {
            type: String,
            default: "",
        },
        newTab: Boolean,
    },
};
</script>
