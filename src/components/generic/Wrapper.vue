<style lang="scss" scoped>
.wrapper {
    position: relative;
    background-color: var(--back);
    padding: 2rem 10vw;
}

@media (min-width: 1440px) {
    .wrapper {
        padding: 2rem 20vw;
    }
}
@media (max-width: 768px) {
    .wrapper {
        padding: 2rem 5vw 5rem 5vw;
    }
}
</style>

<template>
    <div class="flex justify-center py-8">
        <div class="w-11/12 sm:w-5/6 lg:w-2/3 2xl:w-1/2">
            <slot />
        </div>
    </div>
</template>
