<template>
    <div class="mt-4">
        <!-- Initial set-up -->
        <form
            v-if="page === 0"
            class="grid gap-4"
            @submit.prevent="
                () => {
                    __setup();
                    section = 0;
                    page += 1;
                }
            "
        >
            <txt grey>Progress each session in just a few clicks</txt>
            <txt-input
                id="range"
                ref="range"
                name="range"
                type="number"
                :label="`From microcycle ${currentWeek} to ${plan.duration}:`"
                :min="currentWeek + 1"
                :max="plan.duration"
                :value="target"
                @output="(data) => (target = data)"
                required
            />
            <txt-input
                name="range"
                type="number"
                min="1"
                label="Days until next sessions:"
                :value="daysBetween"
                @output="(data) => (daysBetween = data)"
                required
            />
            <default-button
                type="submit"
                :disabled="!daysBetween || !target"
                aria-label="Next"
            >
                Next
            </default-button>
        </form>

        <!-- Edit page -->
        <div v-else-if="page === 1">
            <!-- Per session -->
            <form
                v-for="(s, sIndex) in progressProtocols"
                v-show="section === sIndex"
                :key="`session-${s.name}-${sIndex}`"
                class="grid gap-4"
                @submit.prevent="
                    () => {
                        sIndex === progressProtocols.length - 1
                            ? (page += 1)
                            : (section += 1);
                    }
                "
            >
                <card-wrapper class="p-4" no-hover>
                    <txt bold>
                        {{ s.name }}
                    </txt>
                    <txt grey>
                        {{ s.date }}
                    </txt>
                    <div v-if="s.protocols.length">
                        <!-- Per protocol section -->
                        <div
                            v-for="(p, pIndex) in s.protocols"
                            :key="`protocol-${p.name}-${pIndex}`"
                        >
                            <divider class="mt-6 mb-4" />
                            <txt bold>Metric: {{ p.exercise }}</txt>
                            <txt class="mt-2"
                                >Week {{ currentWeek }}: {{ p.protocol }}</txt
                            >

                            <!-- Per input -->
                            <txt-input
                                v-for="(i, iIndex) in s.inputs[pIndex]"
                                type="text"
                                class="mt-2"
                                :key="`input-${p.exercise}-${iIndex}`"
                                :label="`Week ${currentWeek + iIndex + 1}:`"
                                :aria-label="`${p.name}-${iIndex}`"
                                :value="p.protocol"
                                @output="
                                    (data) =>
                                        (progressProtocols[sIndex].inputs[
                                            pIndex
                                        ][iIndex] = data)
                                "
                                required
                            />
                        </div>
                    </div>
                    <txt v-else grey>No tracked data found in this session</txt>
                </card-wrapper>
                <div>
                    <default-button
                        theme="red"
                        :on-click-prevent="
                            () => (sIndex === 0 ? (page -= 1) : (section -= 1))
                        "
                        aria-label="Back"
                        prevent
                    >
                        Back
                    </default-button>
                    <default-button type="submit" aria-label="Next"
                        >Next</default-button
                    >
                </div>
            </form>
        </div>

        <!-- Complete flow -->
        <form v-else-if="page === 2" @submit.prevent="__complete">
            <txt bold>You're all set</txt>
            <txt grey>
                Are you ready to progress the
                {{ selectedIds.length > 1 ? "sessions" : "session" }}
            </txt>
            <div class="mt-4">
                <default-button
                    theme="red"
                    :on-click-prevent="() => (page -= 1)"
                    aria-label="Back"
                    prevent
                >
                    Back
                </default-button>
                <default-button type="submit" aria-label="Progress"
                    >Progress</default-button
                >
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import appState from "../../../../../../../store/modules/appState";
import utilsStore from "../../../../../../../store/modules/utils";
import planStore from "../../../../../../../store/modules/plan";
import { Protocol } from "../../../../../../../store/modules/types";
import GeneralMixins from "../../../../../../../generalMixins";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../../../../../../components/generic/CardWrapper.vue"
    );

type ProgressProtocol = {
    id: number;
    name: string;
    date: string;
    notes: string;
    protocols: Protocol[];
    inputs: string[][];
};

@Component({
    components: {
        CardWrapper,
    },
})
export default class ProgressModal extends Mixins(GeneralMixins) {
    target: number = 2;
    daysBetween: number = 7;
    page: number = 0;
    section: number = 0;
    progressProtocols: ProgressProtocol[] = [];

    get plan() {
        return planStore.plan;
    }
    get selectedIds() {
        return utilsStore.selectedIds;
    }
    get currentWeek() {
        return planStore.currentWeek;
    }

    /** Pulls all the protocols in the selected session. */
    __setup() {
        const sessions = this.plan?.sessions?.filter((s) =>
            this.selectedIds.includes(s.id)
        );

        if (!sessions) return;

        this.progressProtocols = sessions.map(({ id, name, date, notes }) => {
            const protocols = this.pullProtocols(name, notes, date);
            return {
                id,
                name,
                date,
                notes,
                protocols,
                inputs: new Array(protocols.length)
                    .fill("")
                    .map(() =>
                        new Array(this.target - this.currentWeek).fill("")
                    ),
            };
        });
    }

    /** Processes the required changes to sessions before posting it to the database. */
    __process(notes: string, sIndex: number, iIndex: number) {
        this.progressProtocols[sIndex].protocols.forEach(
            ({ exercise, protocol }, pIndex) => {
                const regex = new RegExp(`${exercise}:\\s*${protocol}`, "g");
                notes = notes.replace(
                    regex,
                    `${exercise}: ${this.progressProtocols[sIndex].inputs[pIndex][iIndex]}`
                );
            }
        );
        return notes;
    }

    /** Initiates the changes and POST it to the database. */
    __complete() {
        appState.setLoading(true);

        let iIndex = 0;
        for (
            let week_id = this.currentWeek + 1;
            week_id <= this.target;
            week_id++
        ) {
            try {
                this.progressProtocols.forEach(
                    ({ id: programme_id, name, date, notes }, sIndex) => {
                        planStore.addSession({
                            programme_id,
                            name,
                            date: this.addDays(
                                date,
                                this.daysBetween * (iIndex + 1)
                            ),
                            week_id,
                            notes: this.__process(notes, sIndex, iIndex),
                        });
                    }
                );
            } catch (e) {
                utilsStore.resolveError(e as string);
            }
            iIndex += 1;
        }
        utilsStore.closeModal();
        planStore.setCurrentWeek(this.target);
        utilsStore.deselectAll();
        this.$ga.event("Session", "progress");
        utilsStore.responsePopUpRef?.open({
            title: "Sessions have been progressed",
            text: "Please go through them to make sure that you're happy with it",
        });
        appState.stopLoaders();
    }
}
</script>
