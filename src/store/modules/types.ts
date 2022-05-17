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
    policy: any[];
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

export type BasePopUpParams = {
    title: string;
    text?: string;
};
export type BasePopUpMethods<T> = {
    open: (params: T) => void;
};
export type ConfirmPopUpParams = BasePopUpParams;
export type ConfirmPopUpRef = BasePopUpMethods<ConfirmPopUpParams> | null;
export type ResponsePopUpParams = {
    persist?: boolean;
    backdrop?: boolean;
} & BasePopUpParams;
export type ResponsePopUpRef = BasePopUpMethods<ResponsePopUpParams> | null;
export type UploadPopUpParams = {
    onSuccess: (response: { data: { url: string } }) => void;
} & BasePopUpParams;
export type UploadPopUpRef = BasePopUpMethods<UploadPopUpParams> | null;
export type TxtInputPopUpParams = {
    label: string;
    placeholder: string;
    onSuccess: (link: string) => void;
} & BasePopUpParams;
export type TxtInputPopUpRef = BasePopUpMethods<TxtInputPopUpParams> | null;

export type DropdownItem = {
    label: string;
    value: string;
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

export type WhatsNewItem = {
    title: string;
    desc: string;
    img: string;
};

export type ModalName =
    | "new-client"
    | "whats-new"
    | "install-pwa"
    | "reset-password"
    | "client-user-profile"
    | "preview"
    | "info"
    | "new-plan"
    | "bookings"
    | "toolkit"
    | "duplicate-plan"
    | "move"
    | "shift"
    | "progress"
    | "statistics"
    | "templates"
    | "eula";
