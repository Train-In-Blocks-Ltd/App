<template>
    <form @submit.prevent="createBooking()">
        <div class="grid grid-cols-2 gap-2 mb-4">
            <txt-input
                :value="bookingForm.date"
                :min="today()"
                type="date"
                placeholder="Date"
                aria-label="Date"
                @output="
                    (data) => {
                        bookingForm.date = data;
                        checkForm();
                    }
                "
                required
            />
            <txt-input
                :value="bookingForm.time"
                :min="bookingForm.date === today() ? timeNow() : null"
                type="time"
                placeholder="Time"
                aria-label="Time"
                @output="
                    (data) => {
                        bookingForm.time = data;
                        checkForm();
                    }
                "
                required
            />
        </div>
        <txt-area
            :value="bookingForm.notes"
            rows="5"
            placeholder="Additional information"
            aria-label="Additional information"
            class="mb-4"
            @output="
                (data) => {
                    bookingForm.notes = data;
                    checkForm();
                }
            "
            required
        />
        <default-button
            type="submit"
            class="w-full"
            :is-disabled="disableCreateBookingButton"
        >
            Create booking
        </default-button>
    </form>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: {
        isTrainer: Boolean,
    },
    data() {
        return {
            bookingForm: {
                date: this.today(),
                time: this.timeNow(),
                notes: null,
            },
            disableCreateBookingButton: true,
        };
    },
    computed: mapState(["claims"]),
    methods: {
        /**
         * Creates a new booking.
         */
        async createBooking() {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
                });
                await this.$store.dispatch("createBooking", {
                    clientId: this.isTrainer
                        ? parseInt(this.$route.params.client_id)
                        : this.claims.client_id_db,
                    datetime:
                        this.bookingForm.date + " " + this.bookingForm.time,
                    notes: this.bookingForm.notes,
                    status: this.isTrainer ? "Scheduled" : "Pending",
                    isTrainer: this.isTrainer,
                });
                this.bookingForm = {
                    date: this.today(),
                    time: this.timeNow(),
                    notes: null,
                };
                this.disableCreateBookingButton = true;
                this.$store.dispatch("openResponsePopUp", {
                    title: "Booking created",
                    description: this.isTrainer
                        ? "Your client will be notified of any upcoming bookings that were created."
                        : "Your trainer will be notified of your request.",
                });
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /**
         * Checks and validates form.
         */
        checkForm() {
            this.disableCreateBookingButton = !(
                this.bookingForm.date &&
                this.bookingForm.time &&
                this.bookingForm.notes
            );
        },
    },
};
</script>
