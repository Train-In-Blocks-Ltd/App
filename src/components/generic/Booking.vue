<template>
    <card-wrapper
        :class="{ 'opacity-60': isInThePast(booking) }"
        class="p-2 sm:p-4"
        no-hover
    >
        <txt bold>
            {{
                day(
                    booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]
                ).toUpperCase()
            }}
            {{ booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }}
            at
            {{ shortTime(booking.datetime) }}
        </txt>
        <txt type="tiny" class="my-2">
            {{ booking.notes }}
        </txt>
        <div class="flex justify-between">
            <txt
                :class="
                    getStatusColor(
                        isInThePast(booking) ? 'Past' : booking.status
                    )
                "
                bold
            >
                {{ isInThePast(booking) ? "Past" : booking.status }}
            </txt>
            <a
                v-if="!isInThePast(booking) && !isTrainer"
                href="javascript:void(0)"
                @click="cancelBooking(booking.id, booking.datetime)"
            >
                <txt class="text-red-700">Cancel</txt>
            </a>
            <div class="flex" v-else>
                <a
                    v-if="booking.status === 'Pending' && !isInThePast(booking)"
                    href="javascript:void(0)"
                    aria-label="Accept booking"
                    class="mr-2"
                    @click="acceptBookingRequest(booking.id)"
                >
                    <txt class="text-green-700">Accept</txt>
                </a>
                <a href="javascript:void(0)" @click="cancelBooking">
                    <txt class="text-red-700">
                        {{
                            isInThePast(booking)
                                ? "Delete"
                                : booking.status === "Pending"
                                ? "Reject"
                                : "Cancel"
                        }}
                    </txt>
                </a>
            </div>
        </div>
    </card-wrapper>
</template>

<script>
import { mapState } from "vuex";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    props: {
        booking: Object,
        isTrainer: Boolean,
    },
    components: {
        CardWrapper,
    },
    computed: mapState(["claims"]),
    methods: {
        /** Determines the colour of the text for booking statuses. */
        getStatusColor(status) {
            switch (status) {
                case "Pending" || "Past":
                    return "text-gray-400";
                case "Scheduled":
                    return "text-green-700";
                case "Cancelled" || "Declined":
                    return "text-red-700";
            }
        },

        /** Accepts a booking request made by the client-user. */
        async acceptBookingRequest() {
            if (
                await this.$store.dispatch("openConfirmPopUp", {
                    title: "Are you sure you want to accept this booking?",
                    text: "It will appear as scheduled on your client's profile.",
                })
            ) {
                try {
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
                    });
                    await this.$store.dispatch("updateBooking", {
                        bookingId: this.booking.id,
                        clientId: this.isTrainer
                            ? this.$route.params.client_id
                            : this.claims.client_id_db,
                        status: "Scheduled",
                    });
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Booking request accepted",
                        description:
                            "Your client will be notified of any upcoming bookings that were accepted.",
                    });
                    this.$store.dispatch("setLoading", false);
                } catch (e) {
                    this.$store.dispatch("resolveError", e);
                }
            }
        },

        /** Cancels a booking. */
        async cancelBooking() {
            if (
                await this.$store.dispatch("openConfirmPopUp", {
                    title: "Are you sure you want to cancel this booking?",
                    text: "Your trainer will be notified.",
                })
            ) {
                try {
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
                    });
                    await this.$store.dispatch("deleteBooking", {
                        clientId: this.isTrainer
                            ? this.$route.params.client_id
                            : this.claims.client_id_db,
                        bookingId: this.booking.id,
                        datetime: this.booking.datetime,
                        isTrainer: this.isTrainer,
                    });
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Booking cancelled",
                        description: "Your trainer will be notified",
                    });
                    this.$store.dispatch("setLoading", false);
                } catch (e) {
                    this.$store.dispatch("resolveError", e);
                }
            }
        },
    },
};
</script>
