import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";

@Module({
    namespaced: true,
    name: "utils",
    store,
    dynamic: true,
})
class UtilsModule extends VuexModule {
    search: string = "";
    selectedIds: number[] = [];

    @MutationAction
    async setSearch(search: string) {
        return { search };
    }
    @MutationAction
    async selectAll(selectedIds: number[]) {
        return { selectedIds };
    }
    @MutationAction
    async deselectAll() {
        return { selectedIds: [] as number[] };
    }
    @MutationAction
    async toggleCheckbox(id: number) {
        return {
            selectedIds: !this.selectedIds.includes(id)
                ? [...this.selectedIds, id]
                : this.selectedIds.filter((selectedId) => selectedId !== id),
        };
    }
}

export default getModule(UtilsModule);
