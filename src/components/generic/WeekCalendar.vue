<template>
    <label-wrapper
        :title="`${getMonth(thisWeek[0].date_split[1])} ${
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
                aria-label="Previous week"
                title="Previous week"
            />
            <a
                href="javascript:void(0)"
                :class="{ 'opacity-60 cursor-default': weekDiff === 0 }"
                aria-label="Today"
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
                aria-label="Next week"
                title="Next week"
            />
        </div>

        <!-- Calendar content -->
        <div class="grid gap-2">
            <div
                v-for="(day, index) in thisWeek"
                :key="'day-' + index"
                :class="{
                    'bg-yellow-100 dark:bg-gray-400': today() === day.date,
                }"
                class="flex items-start p-4 rounded-lg"
            >
                <!-- Date -->
                <div class="flex items-center w-1/3 md:w-1/6 mr-4">
                    <txt type="large-body" class="mr-4" bold>
                        {{ getDay(index) }}
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EventRow } from "../../store/modules/types";

const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../components/generic/LabelWrapper.vue"
    );

type WeekRow = { date: string; date_split: string[]; events: EventRow[] };

@Component({
    components: {
        LabelWrapper,
    },
})
export default class WeekCalendar extends Vue {
    @Prop(Array) readonly events!: EventRow[];
    @Prop(Function) readonly onEventPress!: () => void;

    thisWeek: WeekRow[] = [];
    weekDiff: number = 0;

    @Watch("events")
    onEventsChange() {
        this.getWeek();
    }

    created() {
        this.getWeek();
    }

    /** Determines the day based on the date provided. */
    getDay(date: number) {
        const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
        return DAYS[date];
    }

    /** Generates the current week. */
    getWeek() {
        this.thisWeek = [];
        const d = new Date();
        const day = d.getDay();
        const daysDiff = d.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(d.setDate(daysDiff + 7 * this.weekDiff));
        const year = String(weekStart.getFullYear());
        const month = String(weekStart.getMonth() + 1).padStart(2, "0");
        const date = String(weekStart.getDate()).padStart(2, "0");
        const week: WeekRow[] = [
            {
                date: `${year}-${month}-${date}`,
                date_split: [year, month, date],
                events: [],
            },
        ];
        for (let i = 1; i < 7; i++) {
            week.push({
                date: this.addDays(week[0].date, i),
                date_split: this.addDays(week[0].date, i).split("-"),
                events: [],
            });
        }

        week.forEach((day) => {
            this.events.forEach((event) => {
                if (day.date === event.date) day.events.push(event);
            });
        });

        this.thisWeek = week;
    }

    /** Adds specified days to the date provided. */
    addDays(datetime: string, days: number) {
        const d = new Date(datetime);
        d.setDate(d.getDate() + days);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const date = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

    /** Determines the month based on the month index provided. */
    getMonth(month: number) {
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
        month = month - 1;
        return MONTHS[month];
    }
}
</script>
