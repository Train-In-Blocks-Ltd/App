<template>
    <div
        class="fixed top-0 left-0 w-screen min-h-screen bg-black opacity-40 z-30"
        @click="
            () => {
                if (onClick) onClick();
            }
        "
    />
</template>

<script>
export default {
    props: {
        onClick: Function,
    },
};
</script>
