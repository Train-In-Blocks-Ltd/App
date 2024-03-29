import store from ".";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Coupon, TIBUserClaims } from "../common/types";
import { baseAPI } from "../api";
import { emailBuilder } from "../common/helpers";

@Module({
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
        return await { claims };
    }
    @MutationAction
    async updateClaims(claims: TIBUserClaims) {
        const { ga, theme, policy, calendar, weeklyBreakdown } = claims;
        await baseAPI.post("/.netlify/functions/okta", {
            type: "POST",
            body: {
                profile: {
                    ga,
                    theme,
                    policy,
                    calendar,
                    weeklyBreakdown
                },
            },
            url: `${this.claims?.sub}`,
        });

        return {
            claims,
        };
    }

    @MutationAction
    async changePassword({
        oldPassword,
        newPassword,
    }: {
        oldPassword: string;
        newPassword: string;
    }) {
        await baseAPI.post("/.netlify/functions/okta", {
            type: "POST",
            body: {
                oldPassword,
                newPassword,
            },
            url: `${this.claims?.sub}/credentials/change_password`,
        });
        await baseAPI.post("/.netlify/functions/send-email", {
            to: this.claims?.email,
            ...emailBuilder("password-changed"),
        });

        return {};
    }
}

export default getModule(AccountModule);
