<template>
    <label-wrapper :title="title" no-hover>
        <!-- Calendar controls -->
        <div class="flex items-center justify-between my-8">
            <icon-button
                svg="arrow-left"
                :icon-size="32"
                :on-click="
                    () => {
                        weekDiff--;
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
                    }
                "
                aria-label="Next week"
                title="Next week"
            />
        </div>

        <!-- Calendar content -->
        <div class="grid gap-2">
            <div
                v-for="(day, index) in week"
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
                        {{ day.dateSplit[2] }}
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
import { Component, Prop, Mixins } from "vue-property-decorator";
import { EventRow } from "../../store/modules/types";
import GeneralMixins from "../../generalMixins";

const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../components/generic/LabelWrapper.vue"
    );

type WeekRow = { date: string; dateSplit: number[]; events: EventRow[] };

@Component({
    components: {
        LabelWrapper,
    },
})
export default class WeekCalendar extends Mixins(GeneralMixins) {
    @Prop(Array) readonly events!: EventRow[];
    @Prop(Function) readonly onEventPress!: () => void;

    currentMonday: WeekRow | null = null;
    weekDiff: number = 0;

    /** Determines the day based on the date provided. */
    getDay(date: number) {
        const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
        return DAYS[date];
    }

    get week() {
        const d = new Date();
        const day = d.getDay();
        const daysDiff = d.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(d.setDate(daysDiff + 7 * this.weekDiff));
        const year = weekStart.getFullYear();
        const month = parseInt(
            String(weekStart.getMonth() + 1).padStart(2, "0")
        );
        const date = parseInt(String(weekStart.getDate()).padStart(2, "0"));

        this.currentMonday = {
            date: `${year}-${month}-${date}`,
            dateSplit: [year, month, date],
            events: [],
        };
        const week: WeekRow[] = [this.currentMonday];
        for (let i = 1; i < 7; i++) {
            week.push({
                date: this.addDays(week[0].date, i),
                dateSplit: this.addDays(week[0].date, i)
                    .split("-")
                    .map((n) => Number(n)),
                events: [],
            });
        }

        week.forEach((day) => {
            this.events.forEach((event) => {
                if (day.date === event.date) day.events.push(event);
            });
        });

        return week;
    }
    get title() {
        if (!this.currentMonday) return;
        const d = new Date(this.currentMonday.date);
        const month = [
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
        ][d.getMonth()];
        const year = d.getFullYear();
        return `${month} ${year}`;
    }
}
</script>
