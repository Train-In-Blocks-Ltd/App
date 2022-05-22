<template>
    <div>
        <div v-if="bookings.length !== 0" class="flex flex-col mt-8">
            <booking
                v-for="(booking, index) in bookings"
                :key="`all-booking-${index}}`"
                :booking="booking"
                :class="{
                    'mb-4': index !== bookings.length - 1,
                }"
                is-trainer
            />
        </div>
        <txt v-else type="large-body" grey>No bookings yet</txt>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import bookingsModule from "../../../../../../store/modules/bookings.module";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "../../../../../../components/generic/Booking.vue"
    );

@Component({
    components: {
        Booking,
    },
})
export default class AllBookingsModal extends Vue {
    get bookings() {
        return bookingsModule.bookings.filter(
            (booking) =>
                booking.client_id === parseInt(this.$route.params.client_id)
        );
    }
}
</script>
