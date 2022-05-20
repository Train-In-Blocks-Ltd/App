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
                aria-label="Previous month"
                title="Previous month"
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
                aria-label="Today"
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
                aria-label="Next month"
                title="Next month"
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
            <div v-for="(day, index) in month" :key="`day_${index}`">
                <div
                    v-if="!!day"
                    :class="{
                        'bg-transparent shadow-none': !day,
                        'bg-yellow-100 dark:bg-gray-400':
                            today() === new Date(day.date),
                    }"
                    class="min-h-28 p-2 rounded-lg shadow-lg text-right"
                >
                    <!-- Day label -->
                    <txt grey>
                        {{ new Date(day.date).getDate() }}
                    </txt>

                    <!-- Event -->
                    <a
                        v-for="event in day.events"
                        href="javascript:void(0)"
                        :aria-label="event.name"
                        :key="`event-${event.id}`"
                        @click="() => onEventPress(event.id, event.week_id)"
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
                            {{ event.name }}
                        </txt>
                    </a>
                </div>
            </div>
        </div>
    </label-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { EventRow } from "../../store/modules/types";

const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../components/generic/LabelWrapper.vue"
    );

type Day = {
    date: string;
    events: EventRow[];
};

@Component({
    components: {
        LabelWrapper,
    },
})
export default class MonthCalendar extends Vue {
    @Prop(Array) readonly events!: EventRow[];
    @Prop(Function) readonly onEventPress!: () => void;

    currentMonth: string = "";
    currentYear: string = "";
    monthDiff: number = 1;
    month: (Day | null)[] = [];

    @Watch("events")
    onEventsChange() {
        this.getMonth();
    }

    created() {
        this.getMonth();
    }

    /** Converts index to month. */
    getMonthNumber(month: string) {
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
    }

    /** Initiates the calendar and populates it. */
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
        const today = new Date();
        const lastDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + this.monthDiff,
            0
        );
        this.currentMonth = MONTHS[lastDayOfMonth.getMonth()];
        this.currentYear = lastDayOfMonth.getFullYear().toString();
        const monthEnd = lastDayOfMonth.getDate();
        for (let date = 1; date <= monthEnd; date++) {
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
                        this.month.push(null);
                    }
                } else {
                    for (holder = 1; holder < WEEKDAY; holder++) {
                        this.month.push(null);
                    }
                }
            }
            const events: EventRow[] = [];
            this.events.forEach((event) => {
                const DATE_SPLIT = event.date.split("-");
                if (
                    DATE_SPLIT[0] === this.currentYear &&
                    parseInt(DATE_SPLIT[1]) - 1 === lastDayOfMonth.getMonth() &&
                    parseInt(DATE_SPLIT[2]) === date
                ) {
                    events.push(event);
                }
            });
            this.month.push({
                date: `${this.currentYear}-${String(
                    this.getMonthNumber(this.currentMonth)
                ).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
                events,
            });
        }
    }
}
</script>
