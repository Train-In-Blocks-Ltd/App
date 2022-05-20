<template>
    <label-wrapper :title="`${currentMonth} ${currentYear}`" no-hover>
        <!-- Calendar controls -->
        <div class="flex items-center justify-between my-8">
            <icon-button
                svg="arrow-left"
                :size="32"
                :on-click="
                    () => {
                        monthDiff--;
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
                    }
                "
                aria-label="Today"
            >
                Today
            </a>
            <icon-button
                svg="arrow-right"
                :size="32"
                :on-click="
                    () => {
                        monthDiff++;
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
                        'bg-yellow-100 dark:bg-gray-400': today() === day.date,
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { EventRow } from "../../store/modules/types";
import { MONTHS } from "../../common/helpers";

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
    @Prop(Function) readonly onEventPress!: (
        id: number,
        week_id?: number
    ) => void;

    currentMonth: string = "";
    currentYear: string = "";
    monthDiff: number = 1;

    get month() {
        const today = new Date();
        const startDay = new Date(
            today.getFullYear(),
            today.getMonth() - 1 + this.monthDiff,
            1
        ).getDay();
        const monthEnd = new Date(
            today.getFullYear(),
            today.getMonth() + this.monthDiff,
            0
        );
        this.currentMonth = MONTHS[monthEnd.getMonth()];
        this.currentYear = monthEnd.getFullYear().toString();
        const holders = new Array(startDay - 1 >= 0 ? startDay - 1 : 6).fill(
            null
        );
        const days: Day[] = (new Array(monthEnd.getDate()) as Day[])
            .fill({
                date: "",
                events: [],
            })
            .map((_, i) => {
                const date = `${this.currentYear}-${(monthEnd.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${(i + 1).toString().padStart(2, "0")}`;
                return {
                    date,
                    events: this.events.filter((e) => e.date === date),
                };
            });
        const month: Day[] = [...holders, ...days];
        return month;
    }
}
</script>
