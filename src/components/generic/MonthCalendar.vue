<template>
    <label-wrapper :title="`${currentMonth} ${currentYear}`" no-hover>
        <!-- Calendar controls -->
        <div class="flex items-center justify-between my-8">
            <icon-button
                svg="arrow-left"
                :icon-size="32"
                :on-click="
                    () => {
                        monthDiff--;
                        getMonth();
                    }
                "
            />
            <a
                href="javascript:void(0)"
                :class="{ 'opacity-60 cursor-default': monthDiff === 1 }"
                @click="
                    () => {
                        monthDiff = 1;
                        getMonth();
                    }
                "
            >
                Today
            </a>
            <icon-button
                svg="arrow-right"
                :icon-size="32"
                :on-click="
                    () => {
                        monthDiff++;
                        getMonth();
                    }
                "
            />
        </div>

        <!-- Calendar content -->
        <div class="grid grid-cols-7 gap-2">
            <!-- Days -->
            <txt
                v-for="weekDay in [
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun',
                ]"
                :key="weekDay"
                class="text-center"
                >{{ weekDay }}</txt
            >

            <!-- Date grid -->
            <div
                v-for="(day, index) in month"
                :key="`day_${index}`"
                :class="{
                    'bg-transparent shadow-none': day[1] === '',
                    'bg-yellow-100': today() === day[2],
                }"
                class="min-h-28 p-2 rounded-lg shadow-lg text-right"
            >
                <!-- Day label -->
                <txt grey>
                    {{ day[1] }}
                </txt>

                <!-- Event -->
                <a
                    v-for="event in day[0]"
                    href="javascript:void(0)"
                    :key="`event-${event.session_id}`"
                    @click="$parent.goToEvent(event.session_id, event.week_id)"
                >
                    <txt
                        type="tiny"
                        class="mt-1 border-2 text-center rounded hover:opacity-60 transition-opacity"
                        :style="{
                            backgroundColor: event.color,
                            color: event.textColor,
                        }"
                        :class="
                            event.color === undefined ||
                            event.color === '' ||
                            event.color === '#FFFFFF'
                                ? 'border-gray-800'
                                : 'border-transparent'
                        "
                    >
                        {{ event.title }}
                    </txt>
                </a>
            </div>
        </div>
    </label-wrapper>
</template>

<script>
const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "@/components/generic/LabelWrapper"
    );

export default {
    components: {
        LabelWrapper,
    },
    props: {
        events: Array,
        forceUpdate: Number,
    },
    data() {
        return {
            currentMonth: "",
            currentYear: "",
            monthDiff: 1,
            month: [],
        };
    },
    watch: {
        events() {
            this.getMonth();
        },
        forceUpdate() {
            this.getMonth();
        },
    },
    mounted() {
        this.getMonth();
    },
    methods: {
        /**
         * Converts index to month.
         */
        getMonthNumber(month) {
            const MONTHS = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            return MONTHS.indexOf(month) + 1;
        },

        /**
         * Initiates the calendar and populates it.
         */
        getMonth() {
            const MONTHS = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            const TODAY = new Date();
            const LAST_DAY_OF_MONTH = new Date(
                TODAY.getFullYear(),
                TODAY.getMonth() + this.monthDiff,
                "0"
            );
            this.month = [];
            this.currentMonth = MONTHS[LAST_DAY_OF_MONTH.getMonth()];
            this.currentYear = LAST_DAY_OF_MONTH.getFullYear();
            const MONTH_END = LAST_DAY_OF_MONTH.getDate();
            let date;
            for (date = 1; date <= MONTH_END; date++) {
                const WEEKDAY = new Date(
                    `${this.currentYear}-${this.getMonthNumber(
                        this.currentMonth
                    ).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                    })}-${date.toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                    })}`
                ).getDay();
                if (date === 1 && WEEKDAY !== 1) {
                    let holder;
                    if (WEEKDAY === 0) {
                        for (holder = 1; holder < 7; holder++) {
                            this.month.push([[], ""]);
                        }
                    } else {
                        for (holder = 1; holder < WEEKDAY; holder++) {
                            this.month.push([[], ""]);
                        }
                    }
                }
                const DATA_PACKETS = [];
                this.events.forEach((event) => {
                    const DATE_SPLIT = event.date.split("-");
                    if (
                        parseInt(DATE_SPLIT[0]) === this.currentYear &&
                        parseInt(DATE_SPLIT[1] - 1) ===
                            LAST_DAY_OF_MONTH.getMonth() &&
                        parseInt(DATE_SPLIT[2]) === date
                    ) {
                        DATA_PACKETS.push(event);
                    }
                });
                this.month.push([
                    DATA_PACKETS,
                    date,
                    `${this.currentYear}-${String(
                        this.getMonthNumber(this.currentMonth)
                    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
                ]);
            }
        },
    },
};
</script>
