<template>
    <form class="grid gap-4 mt-4" @submit.prevent="moveToWeek()">
        <txt grey>
            This will change the colour code assigned to the sessions.
        </txt>
        <txt-input
            id="range"
            ref="range"
            name="range"
            type="number"
            min="1"
            label="Move to:"
            :value="moveTarget"
            :max="plan.duration"
            @output="(data) => (moveTarget = data)"
            required
        />
        <default-button :disabled="!moveTarget" type="submit" aria-label="Move"
            >Move</default-button
        >
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import utilsModule from "../../../../../../../store/utils.module";
import appModule from "../../../../../../../store/app.module";
import planModule from "../../../../../../../store/plan.module";

@Component
export default class MoveModal extends Vue {
    moveTarget: number = 1;

    get selectedIds() {
        return utilsModule.selectedIds;
    }
    get plan() {
        return planModule.plan;
    }

    /** Moves the selected sessions to specified week. */
    async moveToWeek() {
        appModule.setDontLeave(true);
        await planModule.moveSessions(this.moveTarget);
        utilsModule.closeModal();
        utilsModule.responsePopUpRef?.open({
            title:
                this.selectedIds.length > 1
                    ? "Moved sessions"
                    : "Moved session",
            text: "Your changes have been saved",
        });
        this.moveTarget = 1;
        utilsModule.deselectAll();
        this.$ga.event("Session", "move");
        appModule.stopLoaders();
    }
}
</script>
