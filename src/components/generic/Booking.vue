<template>
    <card-wrapper
        :class="{
            'border-opacity-60 dark:border-gray-400': isInThePast(booking),
        }"
        class="p-2 sm:p-4"
        no-hover
    >
        <txt :class="{ 'opacity-60': isInThePast(booking) }" bold>
            {{
                day(
                    booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]
                ).toUpperCase()
            }}
            {{ booking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }}
            at
            {{ shortTime(booking.datetime) }}
        </txt>
        <txt
            :class="{ 'opacity-60': isInThePast(booking) }"
            type="tiny"
            class="my-2"
        >
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
                aria-label="Cancel"
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
                <a
                    href="javascript:void(0)"
                    :aria-label="
                        isInThePast(booking)
                            ? 'Delete'
                            : booking.status === 'Pending'
                            ? 'Reject'
                            : 'Cancel'
                    "
                    @click="cancelBooking"
                >
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

<script lang="ts">
import {
    Booking as BookingType,
    BookingStatus,
} from "../../store/modules/types";
import { Component, Prop, Mixins } from "vue-property-decorator";
import accountStore from "../../store/modules/account";
import appState from "../../store/modules/appState";
import utilsStore from "../../store/modules/utils";
import bookingsStore from "../../store/modules/bookings";
import clientUserStore from "../../store/modules/clientUser";
import MainMixins from "../../main.mixins";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../components/generic/CardWrapper.vue"
    );

@Component({
    components: {
        CardWrapper,
    },
})
export default class Booking extends Mixins(MainMixins) {
    @Prop(Object) readonly booking!: BookingType;
    @Prop(Boolean) readonly isTrainer!: boolean;

    get claims() {
        return accountStore.claims;
    }

    /** Determines the colour of the text for booking statuses. */
    getStatusColor(status: BookingStatus) {
        switch (status) {
            case "Past":
                return "opacity-60";
            case "Pending":
                return "text-gray-400";
            case "Scheduled":
                return "text-green-700";
            case "Cancelled" || "Declined":
                return "text-red-700";
        }
    }

    /** Accepts a booking request made by the client-user. */
    async acceptBookingRequest() {
        if (!this.claims) return;
        if (
            await utilsStore.confirmPopUpRef?.open({
                title: "Are you sure you want to accept this booking?",
                text: "It will appear as scheduled on your client's profile.",
            })
        ) {
            try {
                appState.setDontLeave(true);
                await bookingsStore.updateBooking({
                    id: this.booking.id,
                    client_id: this.isTrainer
                        ? parseInt(this.$route.params.client_id)
                        : this.claims?.client_id_db,
                    status: "Scheduled",
                });
                utilsStore.responsePopUpRef?.open({
                    title: "Booking request accepted",
                    text: "Your client will be notified of any upcoming bookings that were accepted.",
                });
                appState.stopLoaders();
            } catch (e) {
                utilsStore.resolveError(e as string);
            }
        }
    }

    /** Cancels a booking. */
    async cancelBooking() {
        if (!this.claims) return;
        if (
            await utilsStore.confirmPopUpRef?.open({
                title: "Are you sure you want to cancel this booking?",
                text: "Your trainer will be notified.",
            })
        ) {
            try {
                appState.setDontLeave(true);
                const data: Pick<BookingType, "id" | "client_id" | "datetime"> =
                    {
                        id: this.booking.id,
                        client_id: this.isTrainer
                            ? parseInt(this.$route.params.client_id)
                            : this.claims?.client_id_db,
                        datetime: this.booking.datetime,
                    };
                if (this.isTrainer)
                    await bookingsStore.deleteTrainerBooking(data);
                else await clientUserStore.deleteClientBooking(data);
                utilsStore.responsePopUpRef?.open({
                    title: "Booking cancelled",
                    text: "Your trainer will be notified",
                });
                appState.stopLoaders();
            } catch (e) {
                utilsStore.resolveError(e as string);
            }
        }
    }
}
</script>
