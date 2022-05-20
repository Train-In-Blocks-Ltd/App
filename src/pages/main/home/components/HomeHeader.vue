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
                    :on-click="handleOpenNewClient"
                    :size="28"
                    aria-label="New client"
                    title="New client"
                />
                <icon-button
                    svg="bookmark"
                    :on-click="handleOpenWhatsNew"
                    :size="28"
                    aria-label="What's new"
                    title="What's new"
                    class="ml-4"
                />
                <icon-button
                    v-if="pwa.displayMode === 'browser tab'"
                    svg="download"
                    :on-click="handleOpenInstall"
                    :size="28"
                    aria-label="Install"
                    title="Install"
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
                @output="handleSearch"
            />
        </div>
    </div>
</template>

<script lang="ts">
import appState from "../../../../store/modules/appState";
import utilsStore from "../../../../store/modules/utils";
import { Component, Vue } from "vue-property-decorator";

@Component({
    computed: {
        search: {
            get() {
                return utilsStore.search;
            },
            set(value) {
                utilsStore.setSearch(value);
            },
        },
    },
})
export default class HomeHeader extends Vue {
    get pwa() {
        return appState.pwa;
    }
    get loading() {
        return appState.loading;
    }

    handleSearch(value: string) {
        utilsStore.setSearch(value);
    }

    handleOpenNewClient() {
        utilsStore.openModal({
            name: "new-client",
            size: "xs",
        });
    }

    handleOpenWhatsNew() {
        utilsStore.openModal({
            name: "whats-new",
            size: "lg",
        });
    }

    handleOpenInstall() {
        utilsStore.openModal({
            name: "install-pwa",
        });
    }
}
</script>
