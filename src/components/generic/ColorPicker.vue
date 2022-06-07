<template>
    <div>
        <div
            :style="{
                backgroundColor,
            }"
            class="h-8 w-16 rounded border-2 border-gray-800: dark:border-white hover:opacity-60 transition-opacity mr-4 cursor-pointer"
            @click="editingWeekColor = true"
        />

        <div
            v-if="editingWeekColor"
            class="fixed top-0 left-0 z-40 w-full h-full flex justify-center items-center"
        >
            <backdrop :on-click="() => (editingWeekColor = false)" />
            <card-wrapper
                class="grid grid-cols-2 gap-4 z-40 p-8"
                no-border
                no-hover
            >
                <div
                    v-for="(color, index) in colorPalette"
                    :key="'color_' + index"
                    :style="{ backgroundColor: color }"
                    :class="{ 'opacity-60 cursor-not-allowed': disableButtons }"
                    class="h-8 w-16 rounded cursor-pointer hover:opacity-60 transition-opacity"
                    @click="updateWeekColor(color)"
                />
            </card-wrapper>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import appModule from "../../store/app.module";
import planModule from "../../store/plan.module";
import utilsModule from "../../store/utils.module";

const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPreload: true */ "../../components/generic/Backdrop.vue"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true */ "../../components/generic/CardWrapper.vue"
    );

@Component({
    components: {
        Backdrop,
        CardWrapper,
    },
})
export default class ColorPicker extends Vue {
    @Prop(Array) readonly weekColor!: string[];

    get backgroundColor() {
        if (!this.weekColor) return "#FFFFFF";
        return this.weekColor[planModule.currentWeek - 1];
    }
    get disableButtons() {
        return appModule.disableButtons;
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
        if (this.disableButtons) return;
        try {
            appModule.setDisableButton(true);
            await planModule.updateWeekColor(color);
            appModule.setDisableButton(false);
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
        this.editingWeekColor = false;
    }
}
</script>
