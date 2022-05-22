import { UserClaims } from "@okta/okta-auth-js";

export type DarkmodeType = "light" | "dark" | "system";

export type TIBUserClaims = UserClaims & {
    ga: boolean;
    theme: DarkmodeType;
    policy: any[];
    user_type: "Admin" | "Client" | "Trainer";
    client_id_db: number;
};

export type CalendarGuide = {
    name: string;
    link: string;
};

export type PolicyLink = {
    title: string;
    link: string;
};

export type Coupon = {
    checked: boolean;
    generated: boolean;
    code: string | null;
};
