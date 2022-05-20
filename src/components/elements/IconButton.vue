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
            :style="{ height: `${size}px`, width: `${size}px` }"
            :src="require(`@/assets/icons/${svg}.svg`)"
        />
    </div>
</template>

<script>
export default {
    props: {
        svg: String,
        svgClass: String,
        size: Number,
        onClick: Function,
        disabled: Boolean,
    },
};
</script>
