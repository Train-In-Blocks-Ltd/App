<template>
    <div>
        <div class="flex justify-between">
            <txt type="subtitle">{{ title }}</txt>
            <slot name="right" />
        </div>
        <slot name="under" />
    </div>
</template>

<script>
export default {
    props: {
        title: String,
    },
};
</script>
