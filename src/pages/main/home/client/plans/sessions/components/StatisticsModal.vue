<template>
    <div class="mt-4">
        <!-- Statistics options -->
        <div>
            <dropdown
                label="Measurement"
                class="mb-2"
                :value="selectedDataName"
                :items="measurementDropdownItems"
                @output="(data) => (selectedDataName = data)"
            />
            <dropdown
                v-if="showDataTypeSelector"
                label="Data type"
                class="mb-2"
                :value="selectedDataType"
                :items="dataTypeDropdownItems"
                @output="(data) => (selectedDataType = data)"
            />
            <dropdown
                label="Chart type"
                class="mb-4"
                :value="selectedChartType"
                :items="chartTypeDropdownItems"
                @output="(data) => (selectedChartType = data)"
            />
            <div
                v-if="showDataTypeSelector && dataToVisualise.length !== 0"
                :style="{ backgroundColor: 'var(--fore)' }"
                noHover
            >
                <div
                    v-for="(desc, descIndex) in descData"
                    :key="`desc-option-${descIndex}`"
                >
                    <txt bold>
                        {{ desc[0] }}
                    </txt>
                    <txt>
                        {{ desc[1] }}
                    </txt>
                </div>
            </div>
        </div>

        <!-- Table preview -->
        <div
            v-show="protocolErrors.length !== 0"
            :style="{ backgroundColor: 'var(--fore)' }"
            noHover
        >
            <txt>
                ERROR: Please check that the following exercises and
                measurements are using the correct format.
            </txt>
            <table>
                <tr>
                    <th>Session</th>
                    <th>Date</th>
                    <th>Exercise</th>
                    <th>Protocol</th>
                </tr>
                <tr
                    v-for="(error, errorIndex) in protocolErrors"
                    :key="`protocol-error-${errorIndex}`"
                >
                    <td>{{ error.sessionName }}</td>
                    <td>{{ error.sessionDate }}</td>
                    <td>{{ error.exerciseName }}</td>
                    <td>{{ error.protocol }}</td>
                </tr>
            </table>
        </div>

        <!-- Chart -->
        <simple-chart
            v-if="dataToVisualise.length !== 0"
            :data-points="dataToVisualise"
            :labels="labelsToVisualise"
            :dates="dateDaysToVisualise"
            :chart-type="selectedChartType"
            :reset="resetGraph"
            :data-type="{
                name: selectedDataName,
                type: selectedDataType,
            }"
            :show-data-type="showDataTypeSelector"
            aria-label="Graph"
        />

        <!-- Placeholder -->
        <div v-else>
            <txt type="large-body" bold>No data to plot on the graph</txt>
            <txt>
                Make sure that you've used the correct format and have chosen a
                selection above
            </txt>
        </div>
    </div>
</template>

<script>
const SimpleChart = () =>
    import(
        /* webpackChunkName: "components.simpleChart", webpackPrefetch: true */ "@/components/SimpleChart"
    );

export default {
    components: {
        SimpleChart,
    },
    data() {
        return {
            descData: [],
            largestValue: null,
            smallestValue: null,
            showLoadsVolumeOptions: false,
            selectedDataName: "Plan Overview",
            optionsForDataName: [
                {
                    label: "Plan Overview",
                    value: "Plan Overview",
                },
            ],
            selectedDataType: "Sets",
            showDataTypeSelector: true,
            selectedChartType: "line",
            resetGraph: 0,
            dataToVisualise: [],
            labelsToVisualise: [],
            planOverviewDates: [],
            dateDaysToVisualise: [],
            protocolErrors: [],

            chartTypeDropdownItems: [
                {
                    label: "Line",
                    value: "line",
                },
                {
                    label: "Scatter",
                    value: "scatter",
                },
            ],
        };
    },
    computed: {
        plan() {
            return this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            );
        },
        dataTypeDropdownItems() {
            const extraItems =
                this.selectedDataName === "Plan Overview" ||
                this.showLoadsVolumeOptions
                    ? [
                          {
                              label: "Load",
                              value: "Load",
                          },
                          {
                              label: "Volume",
                              value: "Volume",
                          },
                      ]
                    : [];

            return [
                {
                    label: "Sets",
                    value: "Sets",
                },
                {
                    label: "Reps",
                    value: "Reps",
                },
                ...extraItems,
            ];
        },
        sessionDataPackets() {
            if (!this.plan.sessions) return [];
            return this.sort_sessions(this.plan)
                .sessions.filter((session) => !!session.notes)
                .map((session) =>
                    this.pull_protocols(
                        session.name,
                        session.notes,
                        session.date
                    )
                );
        },
        measurementDropdownItems() {
            if (!this.sessionDataPackets)
                return [
                    {
                        label: "Plan Overview",
                        value: "Plan Overview",
                    },
                ];
            const options = [];
            this.sessionDataPackets.forEach((session) =>
                options.push(
                    ...session.map((packet) =>
                        this.proper_case(packet.exerciseName)
                    )
                )
            );
            return ["Plan Overview", ...new Set(options)].map((option) => {
                return {
                    label: option,
                    value: option,
                };
            });
        },
    },
    methods: {
        /**
         * Calculates and generates data on selected a new option.
         */
        selection() {
            /**
             * Creates a data point
             */
            class DataPoint {
                constructor(parent, dataPacket, returnDataType) {
                    this.parent = parent;
                    this.sessionName = dataPacket.sessionName;
                    this.sessionDate = dataPacket.sessionDate;
                    this.exerciseName = dataPacket.exerciseName;
                    this.protocol = dataPacket.exerciseProtocol.replace(
                        /\s/g,
                        ""
                    );
                    this.returnDataType = returnDataType;
                    this.regexSetsReps = /(\d*)x((\d*\/*)*)/gi;
                    this.regexLoad = /at\s*((\d\.*\/*)*)\s*\w*/gi;
                    this.regexGetNumber = /[0-9.]+/gi;
                }

                /**
                 * Indexes the correct function to extract for each type of data.
                 * @returns The extracted value.
                 */
                get calculate() {
                    switch (this.returnDataType) {
                        case "Sets":
                            return this.getSets(true);
                        case "Reps":
                            return this.getReps();
                        case "Load":
                            return this.getLoad();
                        case "Volume":
                            return this.getReps() * this.getLoad();
                        case "Other":
                            return this.getOtherMeasure();
                    }
                }

                /**
                 * Extracts the sets.
                 * @param {boolean} returnAdditionalDescData - Whether to load the largest and smallest value to Vue data.
                 * @returns The extracted value.
                 */
                getSets(returnAdditionalDescData) {
                    let returnValue;
                    let finder;
                    while (
                        (finder = this.regexSetsReps.exec(this.protocol)) !==
                        null
                    ) {
                        if (finder.index === this.regexSetsReps.lastIndex)
                            this.regexSetsReps.lastIndex++;
                        finder.forEach((setsMatch, setsIndex) => {
                            if (setsIndex === 1) {
                                returnValue = parseFloat(setsMatch);
                                if (returnAdditionalDescData) {
                                    this.parent.largestValue =
                                        this.parent.largestValue === null
                                            ? parseFloat(setsMatch)
                                            : this.parent.largestValue <
                                              parseFloat(setsMatch)
                                            ? parseFloat(setsMatch)
                                            : this.parent.largestValue;
                                    this.parent.smallestValue =
                                        this.parent.smallestValue === null
                                            ? parseFloat(setsMatch)
                                            : this.parent.smallestValue >
                                              parseFloat(setsMatch)
                                            ? parseFloat(setsMatch)
                                            : this.parent.smallestValue;
                                }
                            }
                        });
                    }
                    return returnValue;
                }

                /**
                 * Extracts the reps.
                 * @returns The extracted value.
                 */
                getReps() {
                    const NUM_OF_SETS = this.getSets(false);
                    let returnValue = 0;
                    let repsFinder;
                    while (
                        (repsFinder = this.regexSetsReps.exec(
                            this.protocol
                        )) !== null
                    ) {
                        if (repsFinder.index === this.regexSetsReps.lastIndex) {
                            this.regexSetsReps.lastIndex++;
                        }
                        repsFinder.forEach((repsMatch, repsIndex) => {
                            if (repsIndex === 2) {
                                if (repsMatch.includes("/")) {
                                    const SPLIT_VALUE = repsMatch
                                        .split("/")
                                        .map(Number);
                                    returnValue = SPLIT_VALUE.reduce(
                                        (a, b) => a + b
                                    );
                                    const LARGEST = Math.max(SPLIT_VALUE);
                                    const SMALLEST = Math.min(SPLIT_VALUE);
                                    this.parent.largestValue =
                                        this.parent.largestValue === null
                                            ? LARGEST
                                            : this.parent.largestValue < LARGEST
                                            ? LARGEST
                                            : this.parent.largestValue;
                                    this.parent.smallestValue =
                                        this.parent.smallestValue === null
                                            ? SMALLEST
                                            : this.parent.smallestValue >
                                              SMALLEST
                                            ? SMALLEST
                                            : this.parent.smallestValue;
                                } else {
                                    returnValue =
                                        parseFloat(repsMatch) * NUM_OF_SETS;
                                    this.parent.largestValue =
                                        this.parent.largestValue === null
                                            ? parseFloat(repsMatch)
                                            : this.parent.largestValue <
                                              parseFloat(repsMatch)
                                            ? parseFloat(repsMatch)
                                            : this.parent.largestValue;
                                    this.parent.smallestValue =
                                        this.parent.smallestValue === null
                                            ? parseFloat(repsMatch)
                                            : this.parent.smallestValue >
                                              parseFloat(repsMatch)
                                            ? parseFloat(repsMatch)
                                            : this.parent.smallestValue;
                                }
                            }
                        });
                    }
                    return returnValue;
                }

                /**
                 * Extracts the loads.
                 * @returns The extracted value.
                 */
                getLoad() {
                    const NUM_OF_SETS = this.getSets(false);
                    let returnValue = 0;
                    let loadFinder;
                    while (
                        (loadFinder = this.regexLoad.exec(this.protocol)) !==
                        null
                    ) {
                        if (loadFinder.index === this.regexLoad.lastIndex) {
                            this.regexLoad.lastIndex++;
                        }
                        loadFinder.forEach((loadMatch, loadIndex) => {
                            if (loadIndex === 1) {
                                if (loadMatch.includes("/")) {
                                    const SPLIT_VALUE = loadMatch
                                        .split("/")
                                        .map(Number);
                                    returnValue = SPLIT_VALUE.reduce(
                                        (a, b) => a + b
                                    );
                                    const LARGEST = Math.max(SPLIT_VALUE);
                                    const SMALLEST = Math.min(SPLIT_VALUE);
                                    this.parent.largestValue =
                                        this.parent.largestValue === null
                                            ? LARGEST
                                            : this.parent.largestValue < LARGEST
                                            ? LARGEST
                                            : this.parent.largestValue;
                                    this.parent.smallestValue =
                                        this.parent.smallestValue === null
                                            ? SMALLEST
                                            : this.parent.smallestValue >
                                              SMALLEST
                                            ? SMALLEST
                                            : this.parent.smallestValue;
                                } else {
                                    returnValue =
                                        parseFloat(loadMatch) * NUM_OF_SETS;
                                    this.parent.largestValue =
                                        this.parent.largestValue === null
                                            ? parseFloat(loadMatch)
                                            : this.parent.largestValue <
                                              parseFloat(loadMatch)
                                            ? parseFloat(loadMatch)
                                            : this.parent.largestValue;
                                    this.parent.smallestValue =
                                        this.parent.smallestValue === null
                                            ? parseFloat(loadMatch)
                                            : this.parent.smallestValue >
                                              parseFloat(loadMatch)
                                            ? parseFloat(loadMatch)
                                            : this.parent.smallestValue;
                                }
                            }
                        });
                    }
                    return returnValue;
                }

                /**
                 * Extracts all other measures.
                 * @returns The extracted value.
                 */
                getOtherMeasure() {
                    let returnValue;
                    let numberFinder;
                    while (
                        (numberFinder = this.regexGetNumber.exec(
                            this.protocol
                        )) !== null
                    ) {
                        if (
                            numberFinder.index === this.regexGetNumber.lastIndex
                        ) {
                            this.regexGetNumber.lastIndex++;
                        }
                        numberFinder.forEach((numberMatch) => {
                            returnValue = parseFloat(numberMatch);
                        });
                    }
                    return returnValue;
                }
            }

            this.largestValue = null;
            this.smallestValue = null;
            this.dataToVisualise = [];
            this.labelsToVisualise = [];
            this.planOverviewDates = [];
            this.dateDaysToVisualise = [];
            this.protocolErrors = [];
            let extractedSessionProtocols = [];
            const POSITION_LOOKUP = [];
            const FILTERED_SESSION_PACKETS = this.sessionDataPackets.filter(
                (el) => {
                    return el.length !== 0;
                }
            );
            FILTERED_SESSION_PACKETS.forEach(
                (sessionDataPacket, sessionDataPacketIndex) => {
                    extractedSessionProtocols = [];
                    sessionDataPacket.forEach((exerciseDataPacket) => {
                        const EXERCISE_NAME = this.selectedDataName
                            .replace(/\(/g, "\\(")
                            .replace(/\)/g, "\\)");
                        const REGEX = RegExp(EXERCISE_NAME, "gi");
                        if (REGEX.test(exerciseDataPacket.exerciseName)) {
                            this.labelsToVisualise.push([
                                exerciseDataPacket.exerciseName,
                                exerciseDataPacket.sessionDate,
                            ]);
                            this.showDataTypeSelector =
                                exerciseDataPacket.exerciseProtocol.includes(
                                    "x"
                                );
                            this.showLoadsVolumeOptions =
                                exerciseDataPacket.exerciseProtocol.includes(
                                    "at"
                                );
                            this.selectedDataType =
                                !this.showLoadsVolumeOptions &&
                                (this.selectedDataType === "Load" ||
                                    this.selectedDataType === "Volume")
                                    ? "Sets"
                                    : this.selectedDataType;
                            const DATA_POINT = new DataPoint(
                                this,
                                exerciseDataPacket,
                                exerciseDataPacket.exerciseProtocol.includes(
                                    "x"
                                )
                                    ? this.selectedDataType
                                    : "Other"
                            );
                            if (isNaN(DATA_POINT.calculate)) {
                                this.protocolErrors.push({
                                    sessionName: exerciseDataPacket.sessionName,
                                    sessionDate: exerciseDataPacket.sessionDate,
                                    exerciseName:
                                        exerciseDataPacket.exerciseName,
                                    protocol:
                                        exerciseDataPacket.exerciseProtocol,
                                });
                            } else {
                                this.dataToVisualise.push(DATA_POINT.calculate);
                                POSITION_LOOKUP.push(sessionDataPacketIndex);
                            }
                        } else if (
                            this.selectedDataName === "Plan Overview" &&
                            exerciseDataPacket.exerciseProtocol.includes("at")
                        ) {
                            this.showDataTypeSelector = true;
                            const DATA_POINT = new DataPoint(
                                this,
                                exerciseDataPacket,
                                this.selectedDataType
                            );
                            if (isNaN(DATA_POINT.calculate)) {
                                this.protocolErrors.push({
                                    sessionName: exerciseDataPacket.sessionName,
                                    sessionDate: exerciseDataPacket.sessionDate,
                                    exerciseName:
                                        exerciseDataPacket.exerciseName,
                                    protocol:
                                        exerciseDataPacket.exerciseProtocol,
                                });
                            } else {
                                extractedSessionProtocols.push(
                                    DATA_POINT.calculate
                                );
                            }
                        }
                    });

                    if (this.selectedDataName === "Plan Overview") {
                        this.planOverviewDates.push(
                            sessionDataPacket[0].sessionDate
                        );
                    }

                    // Sums for Plan Overview
                    if (extractedSessionProtocols.length !== 0) {
                        this.dataToVisualise.push(
                            extractedSessionProtocols.reduce((a, b) => a + b)
                        );
                        POSITION_LOOKUP.push(sessionDataPacketIndex);
                    }
                }
            );

            // Populates descriptive stats
            if (this.dataToVisualise.length !== 0) {
                const SUM = this.dataToVisualise.reduce((a, b) => a + b);
                const MAX = Math.max(...this.dataToVisualise);
                const MIN = Math.min(...this.dataToVisualise);
                this.descData = [
                    [
                        `Total ${this.selectedDataType.toLowerCase()} from all sessions`,
                        SUM,
                    ],
                    [
                        `Average ${this.selectedDataType.toLowerCase()} across all sessions`,
                        (SUM / this.dataToVisualise.length).toFixed(1),
                    ],
                    [
                        `Most total amount of ${this.selectedDataType.toLowerCase()} from a session`,
                        MAX,
                    ],
                    [
                        `Least total amount of ${this.selectedDataType.toLowerCase()} from a session`,
                        MIN,
                    ],
                    [
                        `% change in ${this.selectedDataType.toLowerCase()} from the lowest to the largest`,
                        ((MAX / MIN - 1) * 100).toFixed(1),
                    ],
                ];
                if (
                    this.selectedDataType !== "Volume" &&
                    this.selectedDataName !== "Plan Overview"
                ) {
                    this.descData = [
                        ...this.descData,
                        [
                            `${
                                this.selectedDataType === "Load"
                                    ? "Heaviest"
                                    : "Largest"
                            } ${this.selectedDataType.toLowerCase()}`,
                            this.largestValue,
                        ],
                        [
                            `${
                                this.selectedDataType === "Load"
                                    ? "Lightest"
                                    : "Smallest"
                            } ${this.selectedDataType.toLowerCase()}`,
                            this.smallestValue,
                        ],
                    ];
                }
            }

            // Sets days difference
            POSITION_LOOKUP.forEach((index, nextIndex) => {
                const NEXT_SESSION =
                    FILTERED_SESSION_PACKETS[POSITION_LOOKUP[nextIndex + 1]] ||
                    false;
                const REFERENCE_DATE = new Date(
                    FILTERED_SESSION_PACKETS[index][0].sessionDate
                );
                const TARGET_DATE =
                    NEXT_SESSION !== false
                        ? new Date(NEXT_SESSION[0].sessionDate)
                        : false;
                this.dateDaysToVisualise.push(
                    TARGET_DATE !== false
                        ? (TARGET_DATE.getTime() - REFERENCE_DATE.getTime()) /
                              (1000 * 3600 * 24)
                        : false
                );
            });

            // Sets labels
            if (this.selectedDataName === "Plan Overview") {
                for (let x = 1; x <= this.dataToVisualise.length; x++) {
                    this.labelsToVisualise.push([
                        "Session " + x,
                        this.planOverviewDates[x - 1],
                    ]);
                }
            }
            this.resetGraph += 1;
        },
    },
};
</script>
