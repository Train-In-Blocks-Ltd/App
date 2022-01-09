<style lang="scss">
.top_bar {
    display: flex;
    justify-content: space-between;
}
</style>

<template>
    <div id="archive" class="view_container">
        <multiselect
            :type="'client'"
            :options="multiselectOptions"
            :selected="selectedIds"
            @response="resolveArchiveMultiselect"
        />
        <div class="top_bar">
            <h1>Archive</h1>
            <a
                v-if="
                    archive.clients.length !== 0 &&
                    selectedIds.length < archive.clients.length
                "
                href="javascript:void(0)"
                @click="
                    () => {
                        $store.commit('setData', {
                            attr: 'selectedIds',
                            data: archive.clients.map(
                                (client) => client.client_id
                            ),
                        });
                    }
                "
            >
                Select all
            </a>
        </div>
        <br />
        <p v-if="archive.clients.length === 0" class="text--small grey">
            No clients are archived
        </p>
        <div v-else>
            <txt-input
                v-model="search"
                type="search"
                rel="search"
                placeholder="Name"
                aria-label="Search by name"
                autocomplete="name"
                inputClass="text--small"
                style="margin-bottom: 2rem"
            />
            <div class="clients_container">
                <skeleton v-if="loading" :type="'archived'" />
                <div
                    v-for="(client, index) in archive.clients"
                    v-show="
                        (!search ||
                            client.name
                                .toLowerCase()
                                .startsWith(search.toLowerCase())) &&
                        !loading
                    "
                    :id="'a' + client.client_id"
                    :key="index"
                    class="client_link_wrapper"
                    :to="'/client/' + client.client_id + '/'"
                >
                    <client-link
                        class="client_link archived"
                        :client="client"
                        :client-index="index"
                        :archive="true"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
const ClientLink = () =>
    import(
        /* webpackChunkName: "components.clientlink", webpackPreload: true  */ "@/components/ClientLink"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPreload: true  */ "@/components/Multiselect"
    );

export default {
    metaInfo() {
        return {
            title: "Archive",
        };
    },
    components: {
        ClientLink,
        Multiselect,
    },
    data() {
        return {
            search: "",
            multiselectOptions: [
                { name: "Unarchive", svg: "svg/archive.svg" },
                { name: "Delete", svg: "svg/bin.svg" },
                { name: "Deselect", svg: null },
            ],
        };
    },
    computed: mapState(["loading", "archive", "selectedIds"]),
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        await this.$parent.setup();
        this.$store.dispatch("endLoading");
    },
    methods: {
        /**
         * Resolves the archive multi-select.
         * @param {string} res - The action selected from the multi-select.
         */
        resolveArchiveMultiselect(res) {
            switch (res) {
                case "Unarchive":
                    this.unarchiveClients();
                    break;
                case "Delete":
                    this.deleteClients();
                    break;
                case "Deselect":
                    this.$store.commit("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                    break;
            }
        },

        /**
         * Deletes trhe selected clients.
         */
        async deleteClients() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                if (this.selectedIds.length !== 0) {
                    if (
                        await this.$parent.$refs.confirm_pop_up.show(
                            "Are you sure that you want to delete all the selected clients?",
                            "We will remove their data(s) from our database and it won't be recoverable."
                        )
                    ) {
                        await this.$store.dispatch(
                            "clientDelete",
                            this.selectedIds
                        );
                        this.$store.dispatch("openResponsePopUp", {
                            title:
                                this.selectedIds.length > 1
                                    ? "Clients deleted"
                                    : "Client Delete",
                            description: "All their data has been removed",
                        });
                        this.$store.commit("setData", {
                            attr: "selectedIds",
                            data: [],
                        });
                    }
                }
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },

        /**
         * Unarchives the selected clients.
         */
        async unarchiveClients() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                if (this.selectedIds.length !== 0) {
                    if (
                        await this.$parent.$refs.confirm_pop_up.show(
                            "Are you sure that you want to unarchive all the selected clients?",
                            "Their datas will be recovered and available on the Home page."
                        )
                    ) {
                        await this.$store.dispatch(
                            "clientUnarchive",
                            this.selectedIds
                        );
                        this.$store.dispatch("openResponsePopUp", {
                            title:
                                this.selectedIds.length > 1
                                    ? "Unarchived clients"
                                    : "Unarchived client",
                            description: "All their data has been recovered",
                        });
                        this.$store.commit("setData", {
                            attr: "selectedIds",
                            data: [],
                        });
                    }
                }
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },
    },
};
</script>
