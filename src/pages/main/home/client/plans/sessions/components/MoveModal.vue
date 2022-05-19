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
import utilsStore from "../../../../../../../store/modules/utils";
import appState from "../../../../../../../store/modules/appState";
import planStore from "../../../../../../../store/modules/plan";

@Component
export default class MoveModal extends Vue {
    moveTarget: number = 1;

    get selectedIds() {
        return utilsStore.selectedIds;
    }
    get plan() {
        return planStore.plan;
    }

    /** Moves the selected sessions to specified week. */
    async moveToWeek() {
        appState.setDontLeave(true);
        await planStore.moveSessions(this.moveTarget);
        utilsStore.closeModal();
        utilsStore.responsePopUpRef?.open({
            title:
                this.selectedIds.length > 1
                    ? "Moved sessions"
                    : "Moved session",
            text: "Your changes have been saved",
        });
        this.moveTarget = 1;
        utilsStore.deselectAll();
        this.$ga.event("Session", "move");
        appState.stopLoaders();
    }
}
</script>
