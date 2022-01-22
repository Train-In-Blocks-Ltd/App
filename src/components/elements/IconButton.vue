<template>
    <div
        class="flex w-max items-center cursor-pointer hover:opacity-60 transition-opacity"
        @click="
            () => {
                if (onClick) onClick();
            }
        "
    >
        <inline-svg
            :class="svgClass"
            :style="{ height: `${iconSize}px`, width: `${iconSize}px` }"
            :src="require(`@/assets/icons/${svg}.svg`)"
        />
    </div>
</template>

<script>
export default {
    props: {
        svg: String,
        svgClass: String,
        iconSize: Number,
        onClick: Function,
    },
};
</script>
