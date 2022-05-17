import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Coupon, DarkmodeType, TIBUserClaims } from "../types";
import { baseAPI } from "../../../api";

@Module({
    namespaced: true,
    name: "account",
    store,
    dynamic: true,
})
class AccountModule extends VuexModule {
    claims: TIBUserClaims | null = null;
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
    @MutationAction
    async setClaims(claims: TIBUserClaims | null) {
        return { claims };
    }
    @MutationAction
    async setClaimsAnalytics(ga: boolean) {
        return {
            claims: {
                ga,
            },
        };
    }
    @MutationAction
    async setClaimsTheme(theme: DarkmodeType) {
        return {
            claims: {
                theme,
            },
        };
    }
    @MutationAction
    async setClaimsPolicy(policy: TIBUserClaims["policy"]) {
        return {
            claims: {
                policy,
            },
        };
    }
    @MutationAction
    async updateClaims() {
        const { ga, theme, policy, calendar } = this.claims!;
        await baseAPI.post("/.netlify/functions/okta", {
            type: "POST",
            body: {
                profile: {
                    ga,
                    theme,
                    policy,
                    calendar,
                },
            },
            url: `${this.claims?.sub}`,
        });

        return {};
    }
}

export default getModule(AccountModule);
