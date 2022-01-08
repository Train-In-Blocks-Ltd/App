<style lang="scss" scoped>
.progression_editor {
    display: grid;
    grid-gap: 1rem;
    .exercise_group {
        display: grid;
        grid-gap: 1rem;
        &:not(:last-child) {
            margin-bottom: 2rem;
        }
    }
    .progression_bottom_bar {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
    }
}

@media (max-width: 768px) {
    .progression_editor .progression_bottom_bar {
        grid-template-columns: 1fr;
    }
}
</style>

<template>
    <div>
        <form
            v-if="progressPage === 0"
            @submit.prevent="
                progressPull(), (progressSection = 0), (progressPage += 1)
            "
        >
            <h3>Copy across to different microcycles</h3>
            <p class="grey">Progress each session in just a few clicks</p>
            <div class="input_section">
                <label for="range"> From {{ currentWeek }} to: </label>
                <input
                    id="range"
                    ref="range"
                    :value="progressInputs.target"
                    class="width_300"
                    name="range"
                    type="number"
                    :min="currentWeek + 1"
                    :max="maxWeek"
                    required
                    @input="
                        (progressInputs.target = $event.target.value),
                            checkForm()
                    "
                />
            </div>
            <div class="input_section">
                <label for="range"> Days until next sessions: </label>
                <input
                    :value="progressInputs.daysBetween"
                    class="width_300"
                    name="range"
                    type="number"
                    min="1"
                    required
                    @input="
                        (progressInputs.daysBetween = $event.target.value),
                            checkForm()
                    "
                />
            </div>
            <button
                type="button"
                class="red_button"
                @click.prevent="
                    ($parent.showProgress = false), willBodyScroll(true)
                "
            >
                Cancel
            </button>
            <button type="submit" :disabled="disableProgressButton">
                Next
            </button>
        </form>
        <div v-else-if="progressPage === 1">
            <form
                v-for="(session, sessionIndex) in progressDataInputs"
                v-show="progressSection === sessionIndex"
                :key="`session_${sessionIndex}`"
                class="progression_editor"
                @submit.prevent="
                    sessionIndex === progressDataInputs.length - 1
                        ? (progressPage += 1)
                        : (progressSection += 1)
                "
            >
                <div>
                    <h3>
                        {{ session.sessionName }}
                    </h3>
                    <p class="grey">
                        {{ session.sessionDate }}
                    </p>
                </div>
                <div v-if="session.sessionExercises.length">
                    <div
                        v-for="(
                            exercise, exerciseIndex
                        ) in session.sessionExercises"
                        :key="`exercise_${sessionIndex}_${exerciseIndex}`"
                        class="exercise_group"
                    >
                        <p class="exercise_name">
                            <b>{{ exercise.exerciseName }}</b
                            ><br />Week {{ currentWeek }}:
                            {{ exercise.exerciseProtocol }}
                        </p>
                        <div
                            v-for="(
                                progression, progressionIndex
                            ) in exercise.progression"
                            :key="`exercise_${sessionIndex}_${exerciseIndex}_${progressionIndex}`"
                        >
                            <p>
                                Week {{ currentWeek + progressionIndex + 1 }}:
                            </p>
                            <input
                                v-model="exercise.progression[progressionIndex]"
                                :aria-label="`${exercise.exerciseName}_${progressionIndex}`"
                                type="text"
                                required
                            />
                        </div>
                        <hr
                            v-if="
                                exerciseIndex !==
                                session.sessionExercises.length - 1
                            "
                        />
                    </div>
                </div>
                <p v-else>No tracked data found in this session</p>
                <div class="progression_bottom_bar">
                    <button
                        class="red_button"
                        type="button"
                        @click.prevent="
                            sessionIndex === 0
                                ? (progressPage -= 1)
                                : (progressSection -= 1)
                        "
                    >
                        Back
                    </button>
                    <button type="submit">Next</button>
                </div>
            </form>
        </div>
        <form
            v-else-if="progressPage === 2"
            @submit.prevent="
                progressComplete(),
                    ($parent.showProgress = false),
                    willBodyScroll(true)
            "
        >
            <h3>You're all set</h3>
            <p class="grey">
                Are you ready to progress the
                {{ sessionsToProgress.length > 1 ? "sessions" : "session" }}
            </p>
            <br />
            <button
                class="red_button"
                type="button"
                @click.prevent="progressPage -= 1"
            >
                Back
            </button>
            <button type="submit">Progress</button>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        planData: Object,
        sessionsToProgress: Array,
        currentWeek: Number,
        maxWeek: Number,
    },
    data() {
        return {
            // User inputs
            progressInputs: {
                target: this.maxWeek,
                daysBetween: 7,
            },
            disableProgressButton: false,

            // Navigation
            progressPage: 0,
            progressSection: 0,

            // Processing
            sessionDataset: [],
            progressDataInputs: [],
        };
    },
    methods: {
        // -----------------------------
        // General
        // -----------------------------

        checkForm() {
            this.disableProgressButton = !(
                this.progressInputs.target && this.progressInputs.daysBetween
            );
        },

        /**
         * Pulls all the protocols in the selected session, ready for the user to manipulate before progressing.
         */
        progressPull() {
            this.progressDataInputs = [];
            this.sessionsToProgress.forEach((sessionId, sessionIdx) => {
                const SESSION = this.planData.sessions.find(
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
         * @param {integer} sessionId - The id of the session.
         * @param {string} sessionNotes - The notes of the session.
         * @param {integer} loc - The week_id of the new changes stored in the change matrix. This matrix is a Vue data that contains the new changes.
         * @returns The processed session notes.
         */
        progress_process(sessionId, sessionNotes, loc) {
            this.progressDataInputs.forEach((session) => {
                let n = 0;
                if (session.sessionId === sessionId) {
                    session.sessionExercises.forEach(
                        (exercise, exericseIdx) => {
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
                                    return n === exericseIdx
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
            this.$store.commit("setData", {
                attr: "loading",
                data: true,
            });
            const PROGRESS_SESSIONS = [];
            this.sessionsToProgress.forEach((sessionId) => {
                PROGRESS_SESSIONS.push(
                    this.planData.sessions.find(
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
                PROGRESS_SESSIONS.forEach((session) => {
                    this.$parent.addSession({
                        clientId: this.$route.params.client_id,
                        planId: this.$route.params.id,
                        sessionName: session.name,
                        sessionDate: this.addDays(
                            session.date,
                            this.progressInputs.daysBetween *
                                (weekCount - START_WEEK)
                        ),
                        sessionNotes: this.progress_process(
                            session.id,
                            session.notes,
                            weekCount - START_WEEK
                        ),
                        sessionWeek: weekCount,
                    });
                });
            }
            this.$parent.currentWeek = this.progressInputs.target;
            this.progressInputs.target = this.maxWeek;
            this.progressInputs.daysBetween = 7;
            this.$parent.deselectAll();
            this.$ga.event("Session", "progress");
            this.$store.dispatch("openResponsePopUp", {
                title: "Sessions have been progressed",
                description:
                    "Please go through them to make sure that you're happy with it",
            });
            this.$store.dispatch("endLoading");
        },
    },
};
</script>
