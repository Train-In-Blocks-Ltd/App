<template>
    <div class="mt-4">
        <dropdown
            class="mb-4"
            :value="selectedTool"
            :items="dropdownItems"
            @output="(data) => (selectedTool = data)"
        />
        <txt-area
            :rows="3"
            placeholder="Use this if you need to make quick notes"
        />
        <div
            v-for="(tool, toolIndex) in calculators"
            v-show="selectedTool === tool.name"
            :key="`tool_${toolIndex}`"
        >
            <txt class="mt-8 mb-2" bold>Data:</txt>
            <txt-input
                v-for="(input, inputIndex) in tool.inputs"
                type="number"
                :value="input.value"
                :input-id="`input_${input.id}`"
                :key="`tool_${inputIndex}`"
                :placeholder="input.label"
                :aria-label="input.label"
                :on-input="() => calculate(tool.id)"
                @output="(data) => (input.value = data)"
            />
            <txt type="large-body" class="mt-8" bold>
                {{ tool.metric }}: {{ result || "_____" }}
                <span v-html="tool.units" />
            </txt>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Calculator, DropdownItem } from "../../../../../store/types";

@Component
export default class ToolkitModal extends Vue {
    selectedTool: string = "Maximal heart rate (Tanaka)";
    result: string | null = null;
    dropdownItems: DropdownItem[] = [
        {
            label: "Maximal heart rate (Tanaka)",
            value: "Maximal heart rate (Tanaka)",
        },
        {
            label: "Maximal heart rate (Gelish)",
            value: "Maximal heart rate (Gelish)",
        },
        {
            label: "Heart rate reserve (Tanaka)",
            value: "Heart rate reserve (Tanaka)",
        },
        {
            label: "Heart rate training zone (Karvonen)",
            value: "Heart rate training zone (Karvonen)",
        },
        {
            label: "Body mass index",
            value: "Body mass index",
        },
        {
            label: "3-site skinfold (Female; Jackson and Pollock)",
            value: "3-site skinfold (Female; Jackson and Pollock)",
        },
        {
            label: "3-site skinfold (Male; Jackson and Pollock)",
            value: "3-site skinfold (Male; Jackson and Pollock)",
        },
        {
            label: "Percentage body fat (Siri)",
            value: "Percentage body fat (Siri)",
        },
    ];
    calculators: Calculator[] = [
        {
            id: "mhr_tanaka",
            name: "Maximal heart rate (Tanaka)",
            inputs: [{ id: "age_tanaka", label: "Age", value: null }],
            metric: "MHR",
            units: "BPM",
        },
        {
            id: "mhr_gelish",
            name: "Maximal heart rate (Gelish)",
            inputs: [{ id: "age_gelish", label: "Age", value: null }],
            metric: "MHR",
            units: "BPM",
        },
        {
            id: "hrr",
            name: "Heart rate reserve (Tanaka)",
            inputs: [
                {
                    id: "mhr_hrr",
                    label: "Maximal heart rate",
                    value: null,
                },
                {
                    id: "rhr_hrr",
                    label: "Resting heart rate",
                    value: null,
                },
            ],
            metric: "HR Reserve",
            units: "BPM",
        },
        {
            id: "hrtz",
            name: "Heart rate training zone (Karvonen)",
            inputs: [
                {
                    id: "intensity_1",
                    label: "Higher intensity (%)",
                    value: null,
                },
                {
                    id: "intensity_2",
                    label: "Lower intensity (%)",
                    value: null,
                },
                {
                    id: "mhr_hrtz",
                    label: "Maximal heart rate",
                    value: null,
                },
                {
                    id: "rhr_hrtz",
                    label: "Resting heart rate",
                    value: null,
                },
            ],
            metric: "HR Zone",
            units: "BPM",
        },
        {
            id: "bmi",
            name: "Body mass index",
            inputs: [
                { id: "weight", label: "Weight (kg)", value: null },
                { id: "height", label: "Height (m)", value: null },
            ],
            metric: "BMI",
            units: "kg/m<sup>2</sup>",
        },
        {
            id: "3_skin_jackson_pollock_female",
            name: "3-site skinfold (Female, Jackson and Pollock)",
            inputs: [
                { id: "age_f", label: "Age", value: null },
                {
                    id: "site1_f",
                    label: "Tricep skinfold (mm)",
                    value: null,
                },
                {
                    id: "site2_f",
                    label: "Thigh skinfold (mm)",
                    value: null,
                },
                {
                    id: "site3_f",
                    label: "Suprailium skinfold (mm)",
                    value: null,
                },
            ],
            metric: "Body density",
            units: "",
        },
        {
            id: "3_skin_jackson_pollock_male",
            name: "3-site skinfold (Male, Jackson and Pollock)",
            inputs: [
                { id: "age_m", label: "Age", value: null },
                {
                    id: "site1_m",
                    label: "Chest skinfold (mm)",
                    value: null,
                },
                {
                    id: "site2_m",
                    label: "Abdomen skinfold (mm)",
                    value: null,
                },
                {
                    id: "site3_m",
                    label: "Thigh skinfold (mm)",
                    value: null,
                },
            ],
            metric: "Body density",
            units: "",
        },
        {
            id: "bf_siri",
            name: "Percentage body fat (Siri)",
            inputs: [
                {
                    id: "body_density",
                    label: "Body density",
                    value: null,
                },
            ],
            metric: "Body fat",
            units: "%",
        },
    ];

    /** Calculates based on the calculator selected. */
    calculate(cal: string) {
        switch (cal) {
            case "mhr_tanaka": {
                this.result = (
                    220 -
                    // @ts-expect-error
                    Number(document.getElementById("input_age_tanaka")?.value)
                ).toString();
                break;
            }
            case "mhr_gelish": {
                this.result = (
                    220 -
                    0.7 *
                        Number(
                            //@ts-expect-error
                            document.getElementById("input_age_gelish")?.value
                        )
                ).toFixed(2);
                break;
            }
            case "hrr": {
                const MAX_HR = Number(
                    //@ts-expect-error
                    document.getElementById("input_mhr_hrr")?.value
                );
                const RESTING_HR = Number(
                    //@ts-expect-error
                    document.getElementById("input_rhr_hrr")?.value
                );
                this.result = (MAX_HR - RESTING_HR).toString();
                break;
            }
            case "hrtz": {
                const INTENSITY_ZONE_1 = Number(
                    //@ts-expect-error
                    document.getElementById("input_intensity_1")?.value / 100
                );
                const INTENSITY_ZONE_2 = Number(
                    //@ts-expect-error
                    document.getElementById("input_intensity_2")?.value / 100
                );
                const MAX_HR = Number(
                    //@ts-expect-error
                    document.getElementById("input_mhr_hrtz")?.value
                );
                const RESTING_HR = Number(
                    //@ts-expect-error
                    document.getElementById("input_rhr_hrtz")?.value
                );
                this.result = `${(
                    INTENSITY_ZONE_1 * (MAX_HR - RESTING_HR) +
                    RESTING_HR
                ).toFixed(2)}–${(
                    INTENSITY_ZONE_2 * (MAX_HR - RESTING_HR) +
                    RESTING_HR
                ).toFixed(2)}`;
                break;
            }
            case "bmi": {
                const WEIGHT = Number(
                    //@ts-expect-error
                    document.getElementById("input_weight")?.value
                );
                const HEIGHT = Number(
                    //@ts-expect-error
                    document.getElementById("input_height")?.value
                );
                this.result = (WEIGHT / (HEIGHT * HEIGHT)).toFixed(2);
                break;
            }
            case "3_skin_jackson_pollock_female": {
                const AGE = Number(
                    //@ts-expect-error
                    document.getElementById("input_age_f")?.value
                );
                const SITE_1 = Number(
                    //@ts-expect-error
                    document.getElementById("input_site1_f")?.value
                );
                const SITE_2 = Number(
                    //@ts-expect-error
                    document.getElementById("input_site2_f")?.value
                );
                const SITE_3 = Number(
                    //@ts-expect-error
                    document.getElementById("input_site3_f")?.value
                );
                const SUM_OF_SITES = SITE_1 + SITE_2 + SITE_3;
                this.result = (
                    1.0994921 -
                    0.0009929 * SUM_OF_SITES +
                    0.0000023 * SUM_OF_SITES * SUM_OF_SITES -
                    0.0001392 * AGE
                ).toFixed(2);
                break;
            }
            case "3_skin_jackson_pollock_male": {
                const AGE = Number(
                    //@ts-expect-error
                    document.getElementById("input_age_m")?.value
                );
                const SITE_1 = Number(
                    //@ts-expect-error
                    document.getElementById("input_site1_m")?.value
                );
                const SITE_2 = Number(
                    //@ts-expect-error
                    document.getElementById("input_site2_m")?.value
                );
                const SITE_3 = Number(
                    //@ts-expect-error
                    document.getElementById("input_site3_m")?.value
                );
                const SUM_OF_SITES = SITE_1 + SITE_2 + SITE_3;
                this.result = (
                    1.10938 -
                    0.0008267 * SUM_OF_SITES +
                    0.0000016 * SUM_OF_SITES * SUM_OF_SITES -
                    0.0002574 * AGE
                ).toFixed(2);
                break;
            }
            case "bf_siri": {
                this.result = (
                    495 /
                        Number(
                            //@ts-expect-error
                            document.getElementById("input_body_density")?.value
                        ) -
                    450
                ).toFixed(2);
                break;
            }
        }
    }
}
</script>
