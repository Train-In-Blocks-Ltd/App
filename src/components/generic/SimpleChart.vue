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

            <!-- Prediction correlation -->
            <txt v-if="chartType === 'scatter' && !isNaN(rValue)" class="ml-4">
                Correlation (r): {{ rValue }}
            </txt>

            <!-- Scatter options -->
            <div
                v-if="chartType === 'scatter' && !isNaN(rValue)"
                class="grid gap-2 mx-4"
            >
                <txt-input
                    name="prediction"
                    type="number"
                    min="1"
                    placeholder="Days since starting the plan"
                    :label="`Predict ${
                        showDataType
                            ? `${dataType.type.toLowerCase()} for ${dataType.name.toLowerCase()}`
                            : dataType.name.toLowerCase()
                    }`"
                    :value="predictionDay"
                    @output="(data) => (predictionDay = data)"
                />
                <txt v-if="predictionDay">
                    Expected
                    {{
                        showDataType
                            ? dataType.type.toLowerCase()
                            : dataType.name.toLowerCase()
                    }}: {{ prediction(predictionDay) }}
                </txt>
                <txt v-if="predictionDay && predictionError">
                    Prediction error (RMS): {{ predictionError }}
                </txt>
            </div>

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

<script>
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPrefetch: true */ "@/components/generic/CardWrapper"
    );

export default {
    components: {
        CardWrapper,
    },
    props: {
        dataPoints: Array,
        labels: Array,
        dates: Array,
        chartType: String,
        reset: Number,
        dataType: Object,
        showDataType: Boolean,
    },
    data() {
        return {
            focusText: "Select a point",
            dataValues: [],
            pathValues: [],

            // Equation
            gradient: null,
            yIntercept: null,
            rValue: null,
            predictionDay: null,
            predictionError: null,
        };
    },
    watch: {
        dataPoints() {
            this.processAndPlot();
        },
        chartType() {
            this.processAndPlot();
        },
        reset() {
            this.focusText = "Select a point";
        },
    },
    mounted() {
        this.processAndPlot();
    },
    methods: {
        /**
         * Generates a prediction based on the day.
         * @param {integer} day - The day specified by the user.
         * @returns A prediction based on previous data.
         */
        prediction(day) {
            const SUM_OF_DAYS = this.dates.reduce((a, b) => a + b);
            const PREDICTED_PROPORTION = (
                this.gradient * 90 * (day / SUM_OF_DAYS) +
                this.yIntercept
            ).toFixed(2);
            const MAX_Y_VALUE = Math.max(...this.dataPoints);
            return (
                (MAX_Y_VALUE * (90 + (10 - PREDICTED_PROPORTION))) /
                90
            ).toFixed(
                this.dataType.type === "Sets" || this.dataType.type === "Reps"
                    ? 0
                    : 2
            );
        },

        /**
         * Shows the details of the selected point.
         */
        select_point(d1, d2, d3) {
            this.focusText = [d1, d2, d3];
        },

        /**
         * Processes the prop data and plots it.
         */
        processAndPlot() {
            class DataProcessor {
                constructor(yDataset, xDataset, pointLabels, outputType) {
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
                                processedPaths: this.regression(),
                            };
                    }
                }

                /**
                 * Instantiates the points.
                 * @param {boolean} toReturn - Whether to return the positional data.
                 * @returns If specified, the positional data of the point.
                 */
                makePoints(toReturn) {
                    const RETURN_DATA_VALUES = [];
                    this.yDataset.forEach((data, index) => {
                        function relativeInterval(xDataset, index) {
                            const sumOfPrevious = (xDataset, index) => {
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
                                    ? (90 / SUM_OF_DATE_DAYS) *
                                      sumOfPrevious(xDataset, index)
                                    : 5;
                            return RETURN_INTERVAL_VALUE;
                        }
                        RETURN_DATA_VALUES.push([
                            [
                                this.relativeToDate
                                    ? relativeInterval(this.xDataset, index)
                                    : (90 / this.yDataset.length) * (index + 1),
                                90 - ((data * 0.8) / this.maxValue) * 100,
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

                /**
                 * Creates the path to connect each point.
                 * @returns The path data.
                 */
                makePaths() {
                    const RETURN_PATH_VALUES = [];
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

                /**
                 * Calculates a least-squares regression.
                 * @returns The path for the regression line.
                 */
                regression() {
                    this.scaledXDataset = [];
                    this.scaledYDataset = [];
                    this.processedPoints.forEach((point) => {
                        this.scaledXDataset.push(point[0][0]);
                        this.scaledYDataset.push(point[0][1]);
                    });

                    // Sample means
                    this.xSampleMean =
                        this.scaledXDataset.reduce((a, b) => a + b) /
                        this.scaledXDataset.length;
                    this.ySampleMean =
                        this.scaledYDataset.reduce((a, b) => a + b) /
                        this.scaledYDataset.length;

                    // Sample SDs
                    const standardDeviation = (dataset, sampleMean) => {
                        const SUM_OF_SQUARES = [];
                        dataset.forEach((datapoint) => {
                            SUM_OF_SQUARES.push(
                                Math.pow(datapoint - sampleMean, 2)
                            );
                        });
                        return Math.sqrt(
                            SUM_OF_SQUARES.reduce((a, b) => a + b) /
                                (dataset.length - 1)
                        );
                    };
                    this.xSampleSD = standardDeviation(
                        this.scaledXDataset,
                        this.xSampleMean
                    );
                    this.ySampleSD = standardDeviation(
                        this.scaledYDataset,
                        this.ySampleMean
                    );

                    // Pearson's correlation
                    const SUM_OF_POINTS = [];
                    for (let i = 0; i < this.scaledXDataset.length; i++) {
                        SUM_OF_POINTS.push(
                            ((this.scaledXDataset[i] - this.xSampleMean) /
                                this.xSampleSD) *
                                ((this.scaledYDataset[i] - this.ySampleMean) /
                                    this.ySampleSD)
                        );
                    }
                    this.rCorrelation =
                        SUM_OF_POINTS.reduce((a, b) => a + b) /
                        (this.scaledXDataset.length - 1);

                    // Equation attributes
                    this.gradient =
                        (this.rCorrelation * this.ySampleSD) / this.xSampleSD;
                    this.yIntercept =
                        this.ySampleMean - this.gradient * this.xSampleMean;

                    // Line plot
                    const y = (x) => {
                        return this.gradient * x + this.yIntercept;
                    };
                    const accuracy = () => {
                        const SUM_OF_SQUARES = [];
                        for (const index in this.scaledXDataset) {
                            SUM_OF_SQUARES.push(
                                Math.pow(
                                    this.scaledYDataset[index] -
                                        y(this.scaledXDataset[index]),
                                    2
                                )
                            );
                        }
                        return Math.sqrt(
                            SUM_OF_SQUARES.reduce((a, b) => a + b) /
                                this.scaledXDataset.length
                        );
                    };
                    this.accuracy = accuracy();
                    return [[5, y(5), 90, y(90)]];
                }
            }

            const DATA = new DataProcessor(
                this.dataPoints,
                this.dates,
                this.labels,
                this.chartType
            );
            this.dataValues = DATA.create.processedPoints || DATA.create;
            this.pathValues = DATA.create.processedPaths || [];
            if (this.chartType === "scatter") {
                this.gradient = DATA.gradient;
                this.yIntercept = DATA.yIntercept;
                this.rValue = (DATA.rCorrelation * -1).toFixed(2);
                this.predictionError = DATA.accuracy.toFixed(2);
            }
        },
    },
};
</script>
