import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Coupon } from "../types";

@Module({
    namespaced: true,
    name: "account",
    store,
    dynamic: true,
})
class AccountModule extends VuexModule {
    coupon: Coupon = {
        checked: false,
        generated: false,
        code: null,
    };

    @MutationAction
    async setCoupon(coupon: Coupon) {
        return {
            coupon,
        };
    }
}

export default getModule(AccountModule);
