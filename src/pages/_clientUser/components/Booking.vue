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
        <div
            v-if="!isInThePast(booking) || booking.status !== 'Scheduled'"
            class="flex justify-between"
        >
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
                v-if="!isInThePast(booking)"
                href="javascript:void(0)"
                @click="cancelBooking(booking.id, booking.datetime)"
            >
                <txt class="text-red-700" bold>Cancel</txt>
            </a>
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
    props: ["booking"],
    components: {
        CardWrapper,
    },
    computed: mapState(["claims"]),
    methods: {
        /**
         * Determines the colour of the text for booking statuses.
         * @param status - The status of the booking.
         * @returns The colour of the text.
         */
        getStatusColor(status) {
            switch (status) {
                case "Pending" || "Past":
                    return "text-gray-200";
                case "Scheduled":
                    return "text-green-700";
                case "Cancelled" || "Declined":
                    return "text-red-700";
            }
        },

        /**
         * Cancels a booking.
         * @param bookingId - The id of the booking.
         * @param datetime - The id of the booking.
         */
        async cancelBooking(bookingId, datetime) {
            if (
                await this.$store.dispatch("openConfirmPopUp", {
                    title: "Are you sure you want to cancel this booking?",
                    text: "Your trainer will be notified.",
                })
            ) {
                try {
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    await this.$store.dispatch("deleteBooking", {
                        clientId: this.claims.client_id_db,
                        bookingId,
                        datetime,
                        isTrainer: false,
                    });
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Booking cancelled",
                        description: "Your trainer will be notified",
                    });
                    this.$store.dispatch("endLoading");
                } catch (e) {
                    this.$store.dispatch("resolveError", e);
                }
            }
        },
    },
};
</script>
