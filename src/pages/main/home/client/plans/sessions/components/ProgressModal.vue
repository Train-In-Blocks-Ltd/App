<template>
    <div class="mt-4">
        <!-- Initial set-up -->
        <form
            v-if="progressPage === 0"
            class="grid gap-4"
            @submit.prevent="
                () => {
                    progressPull();
                    progressSection = 0;
                    progressPage += 1;
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
                :value="progressInputs.target"
                @output="(data) => (progressInputs.target = data)"
                required
            />
            <txt-input
                name="range"
                type="number"
                min="1"
                label="Days until next sessions:"
                :value="progressInputs.daysBetween"
                @output="(data) => (progressInputs.daysBetween = data)"
                required
            />
            <default-button
                type="submit"
                :disabled="
                    !progressInputs.daysBetween || !progressInputs.target
                "
            >
                Next
            </default-button>
        </form>

        <!-- Edit page -->
        <div v-else-if="progressPage === 1">
            <form
                v-for="(session, sessionIndex) in progressDataInputs"
                v-show="progressSection === sessionIndex"
                :key="`session-${sessionIndex}`"
                class="grid gap-4"
                @submit.prevent="
                    sessionIndex === progressDataInputs.length - 1
                        ? (progressPage += 1)
                        : (progressSection += 1)
                "
            >
                <card-wrapper class="p-4" no-hover>
                    <txt bold>
                        {{ session.sessionName }}
                    </txt>
                    <txt grey>
                        {{ session.sessionDate }}
                    </txt>
                    <div v-if="session.sessionExercises.length" class="mt-4">
                        <div
                            v-for="(
                                exercise, exerciseIndex
                            ) in session.sessionExercises"
                            :key="`exercise-${sessionIndex}-${exerciseIndex}`"
                        >
                            <divider class="mb-4" />
                            <txt bold>Metric: {{ exercise.exerciseName }}</txt>
                            <txt class="mt-2"
                                >Week {{ currentWeek }}:
                                {{ exercise.exerciseProtocol }}</txt
                            >
                            <txt-input
                                v-for="(
                                    progression, progressionIndex
                                ) in exercise.progression"
                                type="text"
                                class="mt-2"
                                :key="`exercise-${sessionIndex}-${exerciseIndex}-${progressionIndex}`"
                                :label="`Week ${
                                    currentWeek + progressionIndex + 1
                                }:`"
                                :aria-label="`${exercise.exerciseName}_${progressionIndex}`"
                                :value="exercise.progression[progressionIndex]"
                                @output="
                                    (data) =>
                                        (exercise.progression[
                                            progressionIndex
                                        ] = data)
                                "
                                required
                            />
                            <divider
                                v-if="
                                    exerciseIndex !==
                                    session.sessionExercises.length - 1
                                "
                                class="my-4"
                            />
                        </div>
                    </div>
                    <txt v-else grey>No tracked data found in this session</txt>
                </card-wrapper>
                <div>
                    <default-button
                        theme="red"
                        :on-click-prevent="
                            () =>
                                sessionIndex === 0
                                    ? (progressPage -= 1)
                                    : (progressSection -= 1)
                        "
                        prevent
                    >
                        Back
                    </default-button>
                    <default-button type="submit">Next</default-button>
                </div>
            </form>
        </div>

        <!-- Complete flow -->
        <form
            v-else-if="progressPage === 2"
            @submit.prevent="progressComplete(), ($parent.showProgress = false)"
        >
            <txt bold>You're all set</txt>
            <txt grey>
                Are you ready to progress the
                {{ selectedIds.length > 1 ? "sessions" : "session" }}
            </txt>
            <div class="mt-4">
                <default-button
                    theme="red"
                    :on-click-prevent="() => (progressPage -= 1)"
                    prevent
                >
                    Back
                </default-button>
                <default-button type="submit">Progress</default-button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState } from "vuex";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    components: {
        CardWrapper,
    },
    data() {
        return {
            // User inputs
            progressInputs: {
                target: 2,
                daysBetween: 7,
            },

            // Navigation
            progressPage: 0,
            progressSection: 0,

            // Processing
            sessionDataset: [],
            progressDataInputs: [],
        };
    },
    computed: {
        plan() {
            return this.$store.getters.getPlan({
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
            });
        },
        ...mapState(["selectedIds", "currentWeek"]),
    },
    methods: {
        /**
         * Pulls all the protocols in the selected session, ready for the user to manipulate before progressing.
         */
        progressPull() {
            this.progressDataInputs = [];
            this.selectedIds.forEach((sessionId, sessionIdx) => {
                const SESSION = this.plan.sessions.find(
                    (session) => session.id === sessionId
                );
                this.progressDataInputs.push({
                    sessionId: SESSION.id,
                    sessionName: SESSION.name,
                    sessionDate: SESSION.date,
                    sessionExercises: this.pull_protocols(
                        SESSION.name,
                        SESSION.notes,
                        SESSION.date
                    ),
                });
                this.progressDataInputs[sessionIdx].sessionExercises.forEach(
                    (exercise) => {
                        exercise.progression = new Array(
                            this.progressInputs.target - this.currentWeek
                        ).fill(exercise.exerciseProtocol);
                    }
                );
            });
        },

        /**
         * Processes the required changes to the temporary sessions before posting it to the database.
         */
        progressProcess(sessionId, sessionNotes, loc) {
            this.progressDataInputs.forEach((session) => {
                let n = 0;
                if (session.sessionId === sessionId) {
                    session.sessionExercises.forEach(
                        (exercise, exerciseIdx) => {
                            const REGEX = new RegExp(
                                `${exercise.exerciseName
                                    .replace("(", "\\(")
                                    .replace(")", "\\)")}\\s*:\\s*${
                                    exercise.exerciseProtocol
                                }`,
                                "g"
                            );
                            sessionNotes = sessionNotes.replace(
                                REGEX,
                                (match) => {
                                    return n === exerciseIdx
                                        ? `${exercise.exerciseName}: ${
                                              exercise.progression[loc - 1]
                                          }`
                                        : match;
                                }
                            );
                            n++;
                        }
                    );
                }
            });
            return sessionNotes;
        },

        /**
         * Initiates the changes and POST it to the database.
         */
        progressComplete() {
            this.$store.dispatch("setLoading", {
                loading: true,
            });
            const PROGRESS_SESSIONS = [];
            this.selectedIds.forEach((sessionId) => {
                PROGRESS_SESSIONS.push(
                    this.plan.sessions.find(
                        (session) => session.id === sessionId
                    )
                );
            });
            const START_WEEK = this.currentWeek;
            for (
                let weekCount = this.currentWeek + 1;
                weekCount <= this.progressInputs.target;
                weekCount++
            ) {
                PROGRESS_SESSIONS.forEach(async (session) => {
                    try {
                        await this.$store.dispatch("addSession", {
                            client_id: parseInt(this.$route.params.client_id),
                            data: {
                                programme_id: parseInt(this.$route.params.id),
                                name: session.name,
                                date: this.addDays(
                                    session.date,
                                    this.progressInputs.daysBetween *
                                        (weekCount - START_WEEK)
                                ),
                                notes: this.progressProcess(
                                    session.id,
                                    session.notes,
                                    weekCount - START_WEEK
                                ),
                                week_id: weekCount,
                            },
                        });
                    } catch (e) {
                        this.$store.dispatch("resolveError", e);
                    }
                });
            }
            this.$store.dispatch("closeModal");
            this.$store.commit("SET_DATA", {
                attr: "currentWeek",
                data: this.progressInputs.target,
            });
            this.$store.commit("SET_DATA", {
                attr: "selectedIds",
                data: [],
            });
            this.progressInputs.target = this.plan.duration;
            this.progressInputs.daysBetween = 7;
            this.$ga.event("Session", "progress");
            this.$store.dispatch("openResponsePopUp", {
                title: "Sessions have been progressed",
                description:
                    "Please go through them to make sure that you're happy with it",
            });
            this.$store.dispatch("setLoading", false);
        },
    },
};
</script>
