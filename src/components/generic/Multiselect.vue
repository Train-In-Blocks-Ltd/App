<template>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
        <div
            v-if="selectedIds.length !== 0"
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg w-full p-8 md:p-12"
        >
            <txt type="large-body" class="text-center mb-8" bold
                >Selected {{ selectedIds.length }}
                {{ selectedIds.length === 1 ? type : `${type}s` }} to ...
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
                    :aria-label="option.name"
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
                        :size="31"
                        :class="{ 'text-red-700': option.name === 'Delete' }"
                    />
                </a>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { MultiselectOption } from "@/src/store/modules/types";
import { Component, Vue, Prop } from "vue-property-decorator";
import utilsStore from "../../store/modules/utils";

@Component
export default class Multiselect extends Vue {
    @Prop(String) readonly type!: string;
    @Prop(Array) readonly options!: MultiselectOption[];

    get selectedIds() {
        return utilsStore.selectedIds;
    }
}
</script>
