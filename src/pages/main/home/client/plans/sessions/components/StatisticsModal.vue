<template>
    <div class="mt-4">
        <!-- Statistics options -->
        <div>
            <!-- Measurement dropdown -->
            <dropdown
                label="Measurement"
                class="mb-2"
                :value="selectedDataName"
                :items="measurementDropdownItems"
                @output="
                    (data) => {
                        selectedDataName = data;
                        handleSelectionChange();
                    }
                "
            />

            <!-- Data type dropdown -->
            <dropdown
                v-if="showDataTypeSelector"
                label="Data type"
                class="mb-8"
                :value="selectedDataType"
                :items="dataTypeDropdownItems"
                @output="
                    (data) => {
                        selectedDataType = data;
                        handleSelectionChange();
                    }
                "
            />

            <!-- Descriptive data -->
            <div
                v-if="showDataTypeSelector && dataToVisualise.length !== 0"
                class="bg-white dark:bg-gray-800"
                no-hover
            >
                <div
                    v-for="(desc, descIndex) in descData"
                    :key="`desc-option-${descIndex}`"
                    class="flex"
                >
                    <txt class="mr-4" bold>
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
            class="bg-white dark:bg-gray-800"
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
        <div>
            <canvas id="chart" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import {
    DropdownItem,
    Protocol,
    VisualiseData,
} from "../../../../../../../store/modules/types";
import planStore from "../../../../../../../store/modules/plan";
import GeneralMixins from "../../../../../../../generalMixins";
import { getLoad, getReps, getSets } from "../../../../../../../common/helpers";
import { ChartItem } from "chart.js";
import Chart from "chart.js/auto";

type DataType = "Sets" | "Reps" | "Load" | "Volume";

@Component
export default class StatisticsModal extends Mixins(GeneralMixins) {
    descData: string[] = [];
    showLoadsVolumeOptions: boolean = false;
    selectedDataName: string | "Plan Overview" = "Plan Overview";
    optionsForDataName: DropdownItem[] = [
        {
            label: "Plan Overview",
            value: "Plan Overview",
        },
    ];
    selectedDataType: DataType = "Sets";
    showDataTypeSelector: boolean = true;
    resetGraph: number = 0;
    dataToVisualise: Required<VisualiseData>[] = [];
    planOverviewDates: string[] = [];
    dateDaysToVisualise: any[] = [];
    protocolErrors: Protocol[] = [];
    chart: any = null;

    get plan() {
        return planStore.plan;
    }
    get dataTypeDropdownItems() {
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
    }
    get sessionDataPackets() {
        if (!this.plan?.sessions) return [];
        return this.plan.sessions
            .filter((session) => !!session.notes)
            .map(({ name, notes, date }) =>
                this.pull_protocols(name, notes, date)
            );
    }
    get measurementDropdownItems() {
        if (!this.sessionDataPackets)
            return [
                {
                    label: "Plan Overview",
                    value: "Plan Overview",
                },
            ];
        const options: string[] = [];
        this.sessionDataPackets.forEach((s) =>
            options.push(...s.map(({ exercise }) => exercise))
        );
        return ["Plan Overview", ...new Set(options)].map((option) => {
            return {
                label: option,
                value: option,
            };
        });
    }

    mounted() {
        const chartElement = document.getElementById("chart");
        if (chartElement)
            this.chart = new Chart(chartElement as ChartItem, {
                type: "line",
                data: {
                    datasets: [
                        {
                            data: [],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        this.__generateData();
    }

    __getData(protocol: string) {
        switch (this.selectedDataType) {
            case "Sets":
                return getSets(protocol);
            case "Reps":
                return getReps(protocol);
            case "Load":
                return getLoad(protocol);
            case "Volume":
                return (
                    (getSets(protocol) ?? 0) *
                    (getReps(protocol) ?? 0) *
                    (getLoad(protocol) ?? 0)
                );
            default:
                return undefined;
        }
    }

    __generateData() {
        const processedData: VisualiseData[] = [];
        if (this.selectedDataName === "Plan Overview") {
            this.sessionDataPackets.forEach((s, i) => {
                processedData.push({
                    x: `Session ${i + 1}`,
                    y: s
                        .map(({ protocol }) => this.__getData(protocol))
                        .reduce((a, b) => (a ?? 0) + (b ?? 0)),
                });
                this.chart.update();
            });
        } else {
            const sessionExercisePackets: Protocol[] = [];
            this.sessionDataPackets.forEach((s) => {
                sessionExercisePackets.push(
                    ...s.filter((p) => p.exercise === this.selectedDataName)
                );
            });
            sessionExercisePackets.forEach(({ name, protocol }) => {
                processedData.push({
                    x: name,
                    y: this.__getData(protocol),
                });
            });
        }
        this.chart.data.datasets[0].data = processedData.filter((d) => !!d.y);
        this.chart.update();
    }

    /** Calculates and generates data on selected a new option. */
    handleSelectionChange() {
        this.chart.reset();
        this.__generateData();
    }
}
</script>
