<template>
    <div>
        <div class="relative z-40">
            <div
                :style="{
                    backgroundColor,
                }"
                class="h-8 w-16 rounded border-2 border-gray-800: dark:border-white hover:opacity-60 transition-opacity mr-4 cursor-pointer"
                @click="editingWeekColor = !editingWeekColor"
            />
            <div v-if="editingWeekColor" class="absolute top-8 left-0 z-10">
                <div
                    v-for="(color, index) in colorPalette"
                    :key="'color_' + index"
                    :style="{ backgroundColor: color }"
                    class="h-8 w-16 rounded cursor-pointer hover:opacity-60 transition-opacity mt-2"
                    @click="updateWeekColor(color)"
                />
            </div>
        </div>
        <backdrop
            v-if="editingWeekColor"
            :on-click="() => (editingWeekColor = false)"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import planStore from "../../store/modules/plan";
import utilsStore from "../../store/modules/utils";

const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPreload: true */ "../../components/generic/Backdrop.vue"
    );

@Component({
    components: {
        Backdrop,
    },
})
export default class ColorPicker extends Vue {
    @Prop(Array) readonly weekColor!: string[];

    get backgroundColor() {
        if (!this.weekColor) return "#FFFFFF";
        return this.weekColor[planStore.currentWeek - 1];
    }

    editingWeekColor: boolean = false;
    colorPalette: string[] = [
        "#EB4034",
        "#EB9634",
        "#34EB6B",
        "#346BEB",
        "#303030",
    ];

    async updateWeekColor(color: string) {
        try {
            await planStore.updateWeekColor(color);
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
        this.editingWeekColor = false;
    }
}
</script>
