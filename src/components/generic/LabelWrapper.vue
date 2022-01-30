<template>
    <card-wrapper class="px-4 pb-4 sm:px-8 sm:pb-8" no-hover>
        <div class="flex">
            <txt
                type="large-body"
                class="text-white bg-gray-800 dark:text-gray-800 dark:bg-white p-3 rounded-b-lg"
                bold
                >{{ title }}</txt
            >
        </div>
        <slot />
    </card-wrapper>
</template>

<script>
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    components: {
        CardWrapper,
    },
    props: {
        title: String,
    },
};
</script>
