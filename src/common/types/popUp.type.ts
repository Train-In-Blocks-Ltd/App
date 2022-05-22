export type BasePopUpParams = {
    title: string;
    text?: string;
};
export type BasePopUpMethods<T> = {
    open: (params: T) => void;
};

/* --------------------------------- Confirm -------------------------------- */

export type ConfirmPopUpParams = BasePopUpParams;
export type ConfirmPopUpRef = BasePopUpMethods<ConfirmPopUpParams> | null;

/* -------------------------------- Response -------------------------------- */

export type ResponsePopUpParams = {
    persist?: boolean;
    backdrop?: boolean;
} & BasePopUpParams;
export type ResponsePopUpRef = BasePopUpMethods<ResponsePopUpParams> | null;

/* --------------------------------- Upload --------------------------------- */

export type UploadPopUpParams = {
    onSuccess: (response: { data: { url: string } }) => void;
} & BasePopUpParams;
export type UploadPopUpRef = BasePopUpMethods<UploadPopUpParams> | null;

/* -------------------------------- TxtInput -------------------------------- */

export type TxtInputPopUpParams = {
    label: string;
    placeholder: string;
    onSuccess: (link: string) => void;
} & BasePopUpParams;
export type TxtInputPopUpRef = BasePopUpMethods<TxtInputPopUpParams> | null;
