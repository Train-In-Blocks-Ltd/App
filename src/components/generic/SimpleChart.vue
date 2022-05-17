<template>
    <card-wrapper class="p-4 my-8 bg-white dark:bg-gray-800" no-hover>
        <div class="grid gap-4">
            <!-- Data preview -->
            <div class="flex justify-between">
                <div>
                    <txt type="large-body" bold>
                        {{ focusText !== "Select a point" ? focusText[1] : "" }}
                    </txt>
                    <txt
                        v-if="focusText !== 'Select a point'"
                        type="large-body"
                        grey
                    >
                        {{ focusText[2] === undefined ? "" : focusText[2] }}
                    </txt>
                </div>
                <txt type="large-body" grey>
                    {{
                        focusText !== "Select a point"
                            ? focusText[0]
                            : focusText
                    }}
                </txt>
            </div>

            <!-- Graph -->
            <svg
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                class="simple_chart__view"
                width="100%"
                height="400"
            >
                <!-- x-axis -->
                <g>
                    <line
                        x1="2%"
                        x2="98%"
                        y1="98%"
                        y2="98%"
                        class="stroke-current stroke-2"
                    />
                    <line
                        x1="98%"
                        x2="98%"
                        y1="100%"
                        y2="96%"
                        class="stroke-current stroke-2"
                    />
                    <line
                        x1="2%"
                        x2="2%"
                        y1="100%"
                        y2="96%"
                        class="stroke-current stroke-2"
                    />
                </g>

                <!-- Plot circles -->
                <g class="plot">
                    <g
                        v-for="(data, index) in pathValues"
                        :key="'ptVal_' + index"
                    >
                        <line
                            v-if="!isNaN(data[1])"
                            class="stroke-current stroke-2 opacity-60 transition-all"
                            :x1="`${data[0]}%`"
                            :x2="`${data[2]}%`"
                            :y1="`${data[1]}%`"
                            :y2="`${data[3]}%`"
                            :class="{ scatter_line: chartType === 'scatter' }"
                        />
                    </g>
                    <circle
                        v-for="(data, index) in dataValues"
                        r="4"
                        class="cursor-pointer outline-none stroke-current stroke-2 transition-all"
                        :key="'dtVal_' + index"
                        :cx="`${data[0][0]}%`"
                        :cy="`${data[0][1]}%`"
                        @click="select_point(data[1], data[2], data[3])"
                    />
                </g>
            </svg>

            <!-- x-axis label -->
            <txt class="ml-4" bold>
                {{
                    chartType === "scatter"
                        ? "Sessions relative to days apart"
                        : "Sessions"
                }}
            </txt>

            <!-- List of records -->
            <div class="mt-4 mx-4">
                <!-- Header -->
                <div class="grid grid-cols-3 py-1 px-4">
                    <txt bold>Measure</txt>
                    <txt bold>Date</txt>
                    <txt bold>Value</txt>
                </div>

                <!-- Records -->
                <div
                    v-for="(dataValue, dataValueIndex) in dataPoints"
                    :key="`dataValue_${dataValueIndex}`"
                    class="grid grid-cols-3 py-1 px-4 border-t border-current"
                >
                    <txt>{{ labels[dataValueIndex][0] }}</txt>
                    <txt>{{ labels[dataValueIndex][1] }}</txt>
                    <txt>{{ dataValue }}</txt>
                </div>
            </div>
        </div>
    </card-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPrefetch: true */ "../../components/generic/CardWrapper.vue"
    );

@Component({
    components: {
        CardWrapper,
    },
})
export default class SimpleChart extends Vue {
    @Prop(Array) readonly dataPoints!: any[];
    @Prop(Array) readonly labels!: any[];
    @Prop(Array) readonly dates!: any[];
    @Prop(String) readonly chartType!: string;
    @Prop(Number) readonly reset!: number;
    @Prop(Object) readonly dataType!: any;
    @Prop(Boolean) readonly showDataType!: boolean;

    focusText: (string | number)[] | string = "Select a point";
    dataValues: any[] = [];
    pathValues: any[] = [];

    @Watch("dataPoints")
    onDataChange() {
        this.processAndPlot();
    }
    @Watch("chartType")
    onChartChange() {
        this.processAndPlot();
    }
    @Watch("reset")
    onResetChange() {
        this.focusText = "Select a point";
    }

    mounted() {
        this.processAndPlot();
    }

    /** Shows the details of the selected point. */
    select_point(d1: string, d2: string, d3: string) {
        this.focusText = [d1, d2, d3];
    }

    /** Processes the prop data and plots it. */
    processAndPlot() {
        class DataProcessor {
            yDataset: any[] = [];
            xDataset: any[] = [];
            pointLabels: string[] = [];
            outputType: string | null = null;
            maxValue: number | null = null;
            relativeToDate: boolean = false;
            processedPoints: any[] = [];

            constructor(
                yDataset: any[],
                xDataset: any[],
                pointLabels: string[],
                outputType: string
            ) {
                this.yDataset = yDataset;
                this.xDataset = xDataset;
                this.pointLabels = pointLabels;
                this.outputType = outputType;
                this.maxValue = Math.max(...yDataset);
            }

            get create() {
                switch (this.outputType) {
                    case "line":
                        this.relativeToDate = false;
                        this.makePoints(false);
                        return {
                            processedPoints: this.processedPoints,
                            processedPaths: this.makePaths(),
                        };
                    case "scatter":
                        this.relativeToDate = true;
                        this.makePoints(false);
                        return {
                            processedPoints: this.makePoints(true),
                        };
                }
            }

            /** Instantiates the points. */
            makePoints(toReturn: boolean) {
                const RETURN_DATA_VALUES: any[] = [];
                this.yDataset.forEach((data, index) => {
                    function relativeInterval(xDataset: any[], index: number) {
                        const sumOfPrevious = () => {
                            let returnSum = 0;
                            for (let i = 0; i < index; i++) {
                                returnSum += xDataset[i];
                            }
                            return returnSum;
                        };
                        const SUM_OF_DATE_DAYS = xDataset.reduce(
                            (a, b) => a + (b === false ? 0 : b)
                        );
                        const RETURN_INTERVAL_VALUE =
                            index !== 0
                                ? (90 / SUM_OF_DATE_DAYS) * sumOfPrevious()
                                : 5;
                        return RETURN_INTERVAL_VALUE;
                    }
                    RETURN_DATA_VALUES.push([
                        [
                            this.relativeToDate
                                ? relativeInterval(this.xDataset, index)
                                : (90 / this.yDataset.length) * (index + 1),
                            90 - ((data * 0.8) / (this.maxValue ?? 0)) * 100,
                        ],
                        data,
                        this.pointLabels[index][0],
                        this.pointLabels[index][1],
                    ]);
                });
                if (toReturn) {
                    return RETURN_DATA_VALUES;
                } else {
                    this.processedPoints = RETURN_DATA_VALUES;
                }
            }

            /** Creates the path to connect each point. */
            makePaths() {
                const RETURN_PATH_VALUES: any[] = [];
                this.processedPoints.forEach((data, index) => {
                    if (index < this.processedPoints.length - 1) {
                        RETURN_PATH_VALUES.push([
                            data[0][0],
                            data[0][1],
                            this.processedPoints[index + 1][0][0],
                            this.processedPoints[index + 1][0][1],
                        ]);
                    }
                });
                return RETURN_PATH_VALUES;
            }
        }

        const DATA = new DataProcessor(
            this.dataPoints,
            this.dates,
            this.labels,
            this.chartType
        );
        this.dataValues = DATA.create?.processedPoints ?? [];
        this.pathValues = DATA.create?.processedPaths ?? [];
    }
}
</script>
