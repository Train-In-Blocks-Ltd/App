<template>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
        <div
            v-if="selected.length !== 0"
            class="fixed top-0 left-0 z-10 bg-white dark:bg-gray-800 shadow-lg w-full p-8 md:p-12"
        >
            <txt type="large-body" class="text-center mb-8" bold
                >Selected {{ selected.length }}
                {{ selected.length === 1 ? type : `${type}s` }} to ...
            </txt>
            <div
                :class="
                    options.length % 3 !== 0
                        ? 'sm:grid-cols-2'
                        : 'sm:grid-cols-3'
                "
                class="grid gap-4"
            >
                <a
                    v-for="(option, index) in options"
                    href="javascript:void(0)"
                    class="flex items-center w-max m-auto text-2xl hover:opacity-60 transition-opacity"
                    :key="`${type}_option_${index}`"
                    :style="{
                        color:
                            option.name === 'Delete'
                                ? 'text-red-800'
                                : 'text-gray-800',
                    }"
                    @click="$emit('response', option.name)"
                >
                    <txt
                        class="mr-2"
                        :class="{ 'text-red-700': option.name === 'Delete' }"
                    >
                        {{ option.name }}
                    </txt>
                    <icon
                        v-if="option.svg"
                        :svg="option.svg"
                        :icon-size="31"
                        :class="{ 'text-red-700': option.name === 'Delete' }"
                    />
                </a>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        type: String,
        options: Array,
    },
    computed: {
        selected() {
            return this.$store.state.selectedIds;
        },
    },
};
</script>
