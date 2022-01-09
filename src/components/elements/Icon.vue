<template>
    <inline-svg
        :style="{ height: `${iconSize}px`, width: `${iconSize}px` }"
        :src="require(`@/assets/icons/${svg}.svg`)"
    />
</template>

<script>
export default {
    props: {
        svg: String,
        iconSize: Number,
    },
};
</script>
