import { UserClaims } from "@okta/okta-auth-js";

export type GenericResponse = {
    created_at?: Date;
    updated_at?: Date;
};

export type Template = {
    id: number;
    name: string;
    pt_id: string;
    template: string;
} & GenericResponse;

export type Client = {
    client_id: number;
    pt_id: string;
    archive: number;
    name: string;
    email: string;
    number: string;
    profile_image?: string;
    notifications: number;
    notes: string;
} & GenericResponse;

export type DarkmodeType = "light" | "dark" | "system";

export type PWADisplayMode = "browser tab" | "standalone" | "standalone-ios";
export type PWASettings = {
    deferredPrompt?: Event;
    displayMode: PWADisplayMode;
    canInstall: boolean;
    installed: boolean;
};

export type TIBUserClaims = UserClaims & {
    ga: boolean;
    theme: DarkmodeType;
};
