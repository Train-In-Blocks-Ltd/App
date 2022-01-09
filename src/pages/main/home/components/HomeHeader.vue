<template>
    <div class="grid gap-4 lg:flex justify-between mb-8">
        <txt type="title" isMain>Clients</txt>
        <div class="flex items-center">
            <icon-button
                svg="user-plus"
                :on-click="
                    () => $store.dispatch('openModal', { name: 'new-client' })
                "
                :icon-size="28"
                svg-class="no_fill"
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
                svg-class="no_fill"
            />
            <icon-button
                v-if="pwa.displayMode === 'browser tab'"
                svg="download"
                :on-click="
                    () =>
                        $store.dispatch('openModal', {
                            name: 'install-pwa',
                            size: 'lg',
                        })
                "
                :icon-size="28"
                class="ml-4"
                svg-class="no_fill"
            />
            <txt-input
                type="search"
                rel="search"
                class="ml-4"
                placeholder="Find a client"
                aria-label="Find a client"
                :value="search"
                @output="
                    (data) =>
                        $store.commit('setData', {
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
        ...mapState(["pwa"]),
        search: {
            get() {
                return this.$store.state.search;
            },
            set(value) {
                this.$store.commit("setData", {
                    attr: "search",
                    data: value,
                });
            },
        },
    },
};
</script>
