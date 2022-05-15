import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Booking } from "../types";

@Module({
    namespaced: true,
    name: "bookings",
    store,
    dynamic: true,
})
class BookingsModule extends VuexModule {
    public bookings: Booking[] = [];

    @MutationAction
    async setBookings(bookings: Booking[]) {
        return {
            bookings,
        };
    }
}

export default getModule(BookingsModule);
