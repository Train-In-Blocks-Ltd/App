<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    > .right {
        display: flex;
        align-items: center;
        .search,
        .new_client_button,
        .whats_new_button {
            margin-right: 0.6rem;
        }
    }
}

@media (max-width: 768px) {
    .header {
        display: grid;
        grid-gap: 1rem;
        justify-content: unset;
        > div:last-child {
            justify-content: space-between;
            button {
                margin-left: 0;
            }
        }
    }
}
</style>

<template>
    <div class="header">
        <txt type="title" isMain>Clients</txt>
        <div class="right">
            <txt-input
                type="search"
                rel="search"
                class="search"
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
            <default-button
                :on-click-prevent="
                    () => $store.dispatch('openModal', { name: 'new-client' })
                "
                class="new_client_button"
            >
                New Client
            </default-button>
            <icon-button
                svg="bookmark"
                :on-click="
                    () => {
                        $store.dispatch('openModal', {
                            name: 'whats-new',
                            size: 'lg',
                        });
                        willBodyScroll(false);
                    }
                "
                :icon-size="28"
                class="whats_new_button"
                svg-class="no_fill"
            />
            <icon-button
                v-if="pwa.displayMode === 'browser tab'"
                svg="download"
                :on-click="
                    () => {
                        $store.dispatch('openModal', {
                            name: 'install-pwa',
                            size: 'lg',
                        });
                        willBodyScroll(false);
                    }
                "
                :icon-size="28"
                svg-class="no_fill"
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
