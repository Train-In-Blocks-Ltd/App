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

export type Portfolio =
    | {
          business_name: string;
          notes: string;
          pt_id: string;
          trainer_name: string;
      } & GenericResponse;

export type Booking = {
    id: number;
    client_id: number;
    datetime: Date;
    notes: string;
    status: string;
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
    deferredPrompt: Event | null;
    displayMode: PWADisplayMode;
    canInstall: boolean;
    installed: boolean;
};

export type TIBUserClaims = UserClaims & {
    ga: boolean;
    theme: DarkmodeType;
};

export type NavLinkType = {
    name: string;
    link: string;
    svg: string;
    forUser: string[];
    internal: boolean;
    onClick?: () => void;
};

export type EditorState = "edit" | "save" | "cancel";

export type MultiselectOption = {
    name: string;
    svg?: string;
};

export type ModalSize = "xs" | "sm" | "lg" | "full";
