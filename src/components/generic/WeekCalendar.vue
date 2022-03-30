<template>
    <label-wrapper
        :title="`${get_month(thisWeek[0].date_split[1])} ${
            thisWeek[0].date_split[0]
        }`"
        no-hover
    >
        <!-- Calendar controls -->
        <div class="flex items-center justify-between my-8">
            <icon-button
                svg="arrow-left"
                :icon-size="32"
                :on-click="
                    () => {
                        weekDiff--;
                        getWeek();
                    }
                "
            />
            <a
                href="javascript:void(0)"
                :class="{ 'opacity-60 cursor-default': weekDiff === 0 }"
                @click="
                    () => {
                        weekDiff = 0;
                        getWeek();
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
                        weekDiff++;
                        getWeek();
                    }
                "
            />
        </div>

        <!-- Calendar content -->
        <div class="grid gap-8">
            <div
                v-for="(day, index) in thisWeek"
                :key="'day-' + index"
                :class="{ is_today: day.date === today() }"
                class="flex items-start"
            >
                <!-- Date -->
                <div class="flex items-center w-1/3 md:w-1/6 mr-4">
                    <txt type="large-body" class="mr-4" bold>
                        {{ get_day(index) }}
                    </txt>
                    <txt type="large-body" grey>
                        {{ day.date_split[2] }}
                    </txt>
                </div>

                <!-- Events section -->
                <div class="grid gap-2 w-full">
                    <txt v-if="day.events.length === 0" grey>Rest day</txt>

                    <!-- Event -->
                    <div
                        v-for="(event, indexed) in day.events"
                        class="flex justify-center items-center cursor-pointer border-2 py-2 rounded hover:opacity-60 transition-opacity"
                        :key="'event-' + indexed"
                        :style="{ backgroundColor: event.color }"
                        :class="
                            event.color === undefined ||
                            event.color === '' ||
                            event.color === '#FFFFFF'
                                ? 'border-gray-800'
                                : 'border-transparent'
                        "
                        @click="
                            () => onEventPress(event.session_id, event.week_id)
                        "
                    >
                        <txt :style="{ color: event.textColor }">
                            {{ event.title }}
                        </txt>
                    </div>
                </div>
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
        onEventPress: Function,
    },
    data() {
        return {
            currentWeekStart: null,
            thisWeek: [],
            weekDiff: 0,
        };
    },
    watch: {
        events() {
            this.getWeek();
        },
    },
    created() {
        this.getWeek();
    },
    methods: {
        /**
         * Adds the event to the correct day of the week.
         */
        appendEvents() {
            this.thisWeek.forEach((day) => {
                this.events.forEach((event) => {
                    if (day.date === event.date) {
                        day.events.push(event);
                    }
                });
            });
        },

        /**
         * Determines the day based on the date provided.
         * @param {date} date - The date provided.
         * @returns The day of the week.
         */
        get_day(date) {
            const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
            return DAYS[date];
        },

        /**
         * Generates the current week.
         */
        getWeek() {
            this.thisWeek = [];
            const DATE_CLASS = new Date();
            const DAY = DATE_CLASS.getDay();
            const DAYS_DIFFERENCE =
                DATE_CLASS.getDate() - DAY + (DAY === 0 ? -6 : 1);
            const WEEK_START = new Date(
                DATE_CLASS.setDate(DAYS_DIFFERENCE + 7 * this.weekDiff)
            );
            const YEAR = String(WEEK_START.getFullYear());
            const MONTH = String(WEEK_START.getMonth() + 1).padStart(2, "0");
            const DATE = String(WEEK_START.getDate()).padStart(2, "0");
            const CURRENT_MONDAY = {
                date: `${YEAR}-${MONTH}-${DATE}`,
                date_split: [YEAR, MONTH, DATE],
                events: [],
            };
            this.currentWeekStart = CURRENT_MONDAY;
            this.thisWeek.push(CURRENT_MONDAY);
            for (let i = 1; i < 7; i++) {
                this.thisWeek.push({
                    date: this.addDays(this.thisWeek[0].date, i),
                    date_split: this.addDays(this.thisWeek[0].date, i).split(
                        "-"
                    ),
                    events: [],
                });
            }
            setTimeout(() => {
                this.appendEvents();
            }, 100);
        },

        /**
         * Adds specified days to the date provided.
         * @param {date} date - The date provided.
         * @param {integer} days - The days to add.
         * @returns The new date.
         */
        addDays(date, days) {
            const DATE_CLASS = new Date(date);
            DATE_CLASS.setDate(DATE_CLASS.getDate() + days);
            const YEAR = DATE_CLASS.getFullYear();
            const MONTH = String(DATE_CLASS.getMonth() + 1).padStart(2, "0");
            const DATE = String(DATE_CLASS.getDate()).padStart(2, "0");
            return `${YEAR}-${MONTH}-${DATE}`;
        },

        /**
         * Determines the month based on the month index provided.
         * @param {integer} month - The month index provided.
         * @returns The month as a string.
         */
        get_month(month) {
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
            month = parseInt(month) - 1;
            return MONTHS[month];
        },
    },
};
</script>
