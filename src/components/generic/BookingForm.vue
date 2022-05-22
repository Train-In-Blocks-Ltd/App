<template>
    <form @submit.prevent="createBooking()">
        <div class="grid grid-cols-2 gap-2 mb-4">
            <txt-input
                :value="bookingForm.date"
                :min="today()"
                type="date"
                placeholder="Date"
                aria-label="Date"
                @output="(data) => (bookingForm.date = data)"
                required
            />
            <txt-input
                :value="bookingForm.time"
                :min="bookingForm.date === today() ? timeNow() : null"
                type="time"
                placeholder="Time"
                aria-label="Time"
                @output="(data) => (bookingForm.time = data)"
                required
            />
        </div>
        <txt-area
            :value="bookingForm.notes"
            rows="5"
            placeholder="Additional information"
            aria-label="Additional information"
            class="mb-4"
            @output="(data) => (bookingForm.notes = data)"
            required
        />
        <default-button
            type="submit"
            class="w-full"
            :is-disabled="
                !(bookingForm.date && bookingForm.time && bookingForm.notes)
            "
            aria-label="Create booking"
        >
            Create booking
        </default-button>
    </form>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import MainMixins from "../../main.mixins";
import appState from "../../store/modules/appState";
import accountStore from "../../store/modules/account";
import utilsStore from "../../store/modules/utils";
import bookingsStore from "../../store/modules/bookings";
import clientUserStore from "../../store/modules/clientUser";
import { Booking } from "../../store/modules/types";

@Component
export default class BookingForm extends Mixins(MainMixins) {
    @Prop(Boolean) readonly isTrainer!: boolean;

    bookingForm = {
        date: this.today(),
        time: this.timeNow(),
        notes: null,
    };

    get claims() {
        return accountStore.claims;
    }

    /** Creates a new booking. */
    async createBooking() {
        if (!this.claims) return;
        try {
            appState.setDontLeave(true);
            appState.setDisableButton(true);
            const data: Pick<
                Booking,
                "client_id" | "datetime" | "notes" | "status"
            > = {
                client_id: this.isTrainer
                    ? parseInt(this.$route.params.client_id)
                    : this.claims?.client_id_db,
                datetime: this.bookingForm.date + " " + this.bookingForm.time,
                notes: this.bookingForm.notes ?? "",
                status: this.isTrainer ? "Scheduled" : "Pending",
            };
            if (this.isTrainer) await bookingsStore.createTrainerBooking(data);
            else await clientUserStore.createClientBooking(data);

            this.bookingForm = {
                date: this.today(),
                time: this.timeNow(),
                notes: null,
            };
            utilsStore.responsePopUpRef?.open({
                title: "Booking created",
                text: this.isTrainer
                    ? "Your client will be notified of any upcoming bookings that were created."
                    : "Your trainer will be notified of your request.",
            });
            appState.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }
}
</script>
