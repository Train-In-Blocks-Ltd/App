import { Plan } from "./plan.type";

export * from "./booking.type";
export * from "./popUp.type";
export * from "./modal.type";
export * from "./account.type";
export * from "./plan.type";

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
    plans?: Plan[];
} & GenericResponse;

export type PWADisplayMode = "browser tab" | "standalone" | "standalone-ios";
export type PWASettings = {
    deferredPrompt: Event | null;
    displayMode: PWADisplayMode;
    canInstall: boolean;
    installed: boolean;
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

export type DropdownItem = {
    label: string;
    value: string;
};

export type WhatsNewItem = {
    title: string;
    desc: string;
    img: string;
};

export type Calculator = {
    id: string;
    name: string;
    inputs: { id: string; label: string; value: number | null }[];
    metric: string;
    units: string;
};
