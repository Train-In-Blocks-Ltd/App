<template>
    <div v-if="loading" class="skeleton-box animate-pulse p-4 mb-8">
        <div class="skeleton-item-lg" />
    </div>
    <div v-else class="flex flex-col sm:flex-row justify-between mb-8">
        <txt type="title" isMain>Clients</txt>
        <div
            class="flex items-center justify-between sm:justify-start w-full sm:w-auto mt-4 sm:mt-0"
        >
            <div class="flex items-center">
                <icon-button
                    svg="user-plus"
                    :on-click="
                        () =>
                            $store.dispatch('openModal', {
                                name: 'new-client',
                                size: 'xs',
                            })
                    "
                    :icon-size="28"
                />
                <icon-button
                    svg="bookmark"
                    :on-click="
                        () =>
                            $store.dispatch('openModal', {
                                name: 'whats-new',
                                size: 'lg',
                            })
                    "
                    :icon-size="28"
                    class="ml-4"
                />
                <icon-button
                    v-if="pwa.displayMode === 'browser tab'"
                    svg="download"
                    :on-click="
                        () =>
                            $store.dispatch('openModal', {
                                name: 'install-pwa',
                            })
                    "
                    :icon-size="28"
                    class="ml-4"
                />
            </div>
            <txt-input
                type="search"
                rel="search"
                class="ml-4"
                placeholder="Find a client"
                aria-label="Find a client"
                :value="search"
                @output="
                    (data) =>
                        $store.commit('SET_DATA', {
                            attr: 'search',
                            data,
                        })
                "
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState(["pwa", "loading"]),
        search: {
            get() {
                return this.$store.state.search;
            },
            set(value) {
                this.$store.commit("SET_DATA", {
                    attr: "search",
                    data: value,
                });
            },
        },
    },
};
</script>
