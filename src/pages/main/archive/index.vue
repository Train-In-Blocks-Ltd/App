<template>
    <wrapper id="archive">
        <multiselect
            :type="'client'"
            :options="multiselectOptions"
            @response="resolveArchiveMultiselect"
        />
        <div class="flex justify-between mb-4">
            <txt type="title" main>Archive</txt>
            <a
                v-if="
                    archivedClients.length !== 0 &&
                    selectedIds.length < archivedClients.length
                "
                href="javascript:void(0)"
                aria-label="Select all"
                @click="handleSelectAll"
            >
                <txt>Select all</txt>
            </a>
        </div>

        <div v-if="loading">
            <div class="skeleton-box animate-pulse p-4 mb-8">
                <div class="skeleton-item" />
            </div>
            <div class="skeleton-box animate-pulse p-4">
                <div class="skeleton-item-lg w-3/4" />
                <div class="skeleton-item w-1/3" />
                <div class="skeleton-item w-2/3" />
            </div>
        </div>
        <txt v-else-if="archivedClients.length === 0" type="large-body" grey>
            No clients are archived
        </txt>
        <div v-else>
            <txt-input
                :value="search"
                type="search"
                rel="search"
                placeholder="Name"
                aria-label="Search by name"
                autocomplete="name"
                inputClass="text--small"
                class="mb-8"
                @output="(data) => (search = data)"
            />
            <client-link
                v-for="(client, index) in archivedClients"
                v-show="
                    (!search ||
                        client.name
                            .toLowerCase()
                            .startsWith(search.toLowerCase())) &&
                    !loading
                "
                :key="index"
                :client="client"
                :client-index="index"
                :archive="true"
                class="mb-6"
            />
        </div>
    </wrapper>
</template>

<script lang="ts">
import appModule from "../../../store/modules/app.module";
import utilsModule from "../../../store/modules/utils.module";
import clientsModule from "../../../store/modules/clients.module";
import { MultiselectOption } from "../../../store/modules/types";
import { Component, Vue } from "vue-property-decorator";

const ClientLink = () =>
    import(
        /* webpackChunkName: "components.clientLink", webpackPreload: true  */ "../../../components/generic/ClientLink.vue"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPreload: true  */ "../../../components/generic/Multiselect.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Archive",
        };
    },
    components: {
        ClientLink,
        Multiselect,
    },
})
export default class Archive extends Vue {
    search: string = "";
    multiselectOptions: MultiselectOption[] = [
        { name: "Unarchive", svg: "archive" },
        { name: "Delete", svg: "trash" },
        { name: "Deselect", svg: undefined },
    ];

    get loading() {
        return appModule.loading;
    }
    get archivedClients() {
        return clientsModule.archivedClients;
    }
    get selectedIds() {
        return utilsModule.selectedIds;
    }

    handleSelectAll() {
        utilsModule.selectAll(this.archivedClients.map((c) => c.client_id));
    }

    /** Resolves the archive multi-select. */
    resolveArchiveMultiselect(res: string) {
        switch (res) {
            case "Unarchive":
                this.unarchiveClients();
                break;
            case "Delete":
                this.deleteClients();
                break;
            case "Deselect":
                utilsModule.deselectAll();
                break;
        }
    }

    /** Deletes the selected clients. */
    async deleteClients() {
        try {
            appModule.setDontLeave(true);
            if (this.selectedIds.length !== 0) {
                if (
                    await utilsModule.confirmPopUpRef?.open({
                        title: "Are you sure that you want to delete all the selected clients?",
                        text: "We will remove their data(s) from our database and it won't be recoverable.",
                    })
                ) {
                    clientsModule.deleteClients(this.selectedIds);
                    utilsModule.responsePopUpRef?.open({
                        title:
                            this.selectedIds.length > 1
                                ? "Clients deleted"
                                : "Client Delete",
                        text: "All their data has been removed",
                    });
                    utilsModule.deselectAll();
                }
            }
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Unarchives the selected clients. */
    async unarchiveClients() {
        try {
            appModule.setDontLeave(true);
            if (this.selectedIds.length !== 0) {
                if (
                    await utilsModule.confirmPopUpRef?.open({
                        title: "Are you sure that you want to unarchive all the selected clients?",
                        text: "Their data will be recovered and available on the Home page.",
                    })
                ) {
                    clientsModule.unarchiveClients(this.selectedIds);
                    utilsModule.responsePopUpRef?.open({
                        title:
                            this.selectedIds.length > 1
                                ? "Unarchived clients"
                                : "Unarchived client",
                        text: "All their data has been recovered",
                    });
                    utilsModule.deselectAll();
                }
            }
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }
}
</script>
