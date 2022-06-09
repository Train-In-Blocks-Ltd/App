<template>
    <form class="grid gap-4 mt-4" @submit.prevent="shiftAcross()">
        <txt grey>
            This will move the dates ahead or behind by the specified amount
        </txt>
        <txt-input
            id="range"
            ref="range"
            name="range"
            type="number"
            label="Shift session dates by:"
            :value="shiftDays"
            @output="(data) => (shiftDays = data)"
            required
        />
        <default-button :disabled="!shiftDays" type="submit" aria-label="Shift"
            >Shift</default-button
        >
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import utilsModule from "../../../../../../../store/utils.module";
import appModule from "../../../../../../../store/app.module";
import planModule from "../../../../../../../store/plan.module";

@Component
export default class ShiftModal extends Vue {
    shiftDays: number = 1;

    get selectedIds() {
        return utilsModule.selectedIds;
    }
    get plan() {
        return planModule.plan;
    }

    /** Shifts the selected sessions by specified days. */
    async shiftAcross() {
        appModule.setDontLeave(true);
        await planModule.shiftSessions(this.shiftDays);
        utilsModule.closeModal();
        utilsModule.responsePopUpRef?.open({
            title:
                this.selectedIds.length > 1
                    ? "Shifted sessions"
                    : "Shifted session",
            text: "Your changes have been saved",
        });
        this.shiftDays = 1;
        utilsModule.deselectAll();
        this.$ga.event("Session", "shift");
        appModule.stopLoaders();
    }
}
</script>
