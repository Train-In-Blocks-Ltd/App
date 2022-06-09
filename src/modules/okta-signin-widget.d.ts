declare module "@okta/okta-signin-widget" {
    export default class OktaSignIn implements OktaSignIn {
        constructor(configuration: OktaSignInConfig);

        renderEl(configuration: { el: string }): void;
        remove(): void;
        showSignInToGetTokens: any;

        session: {
            get: (callback: (repsonse: any) => void) => void;
        };
    }

    export type OktaSignInConfigAuthParamsResponseMode =
        | "okta_post_message"
        | "fragment"
        | "query"
        | "form_post";

    export interface OktaSignInConfigAuthParams {
        pkce?: boolean;
        responseMode?: OktaSignInConfigAuthParamsResponseMode;
        issuer?: string;
        display?: "page";
        scopes?: string[];
        responseType?: string[];
        tokenManager?: {
            autoRenew: boolean;
            expireEarlySeconds: number;
        };
    }

    interface OktaSignInConfigi18n {
        en?: {
            "primaryauth.title"?: string;
            "primaryauth.username.placeholder"?: string;
            "primaryauth.username.tooltip"?: string;
            "primaryauth.password.placeholder"?: string;
            "primaryauth.password.tooltip"?: string;
            "error.username.required"?: string;
            "error.password.required"?: string;
            "errors.E0000004"?: string;
        };
    }

    interface OktaSignInConfig {
        baseUrl: string;
        issuer?: string;
        logo?: string;
        clientId?: string;
        redirectUri?: string;
        authParams: OktaSignInConfigAuthParams;
        i18n?: OktaSignInConfigi18n;
    }
}
