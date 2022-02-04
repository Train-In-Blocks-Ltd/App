<template>
    <div
        class="flex w-max items-center hover:opacity-60 transition-opacity"
        :class="disabled ? 'opacity-60' : 'cursor-pointer'"
        @click="
            () => {
                if (onClick && !disabled) onClick();
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
        disabled: Boolean,
    },
};
</script>
