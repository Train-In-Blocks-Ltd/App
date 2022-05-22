export * from "./email";

export const REGEX_NUMBER = /[0-9.]+/gi;

/** Extracts the sets. */
export const getSets = (protocol: string) => {
    if (!protocol.includes("x")) return;
    const set = protocol.split("x");
    if (!set) return undefined;
    return parseFloat(set[0]);
};

/** Extracts the reps. */
export const getReps = (protocol: string) => {
    if (!protocol.includes("x")) return;
    const reps = protocol.split("x")[1];
    if (reps.includes("/")) {
        const splitValue = reps.split("/").map(Number);
        return splitValue.reduce((a, b) => a + b);
    } else return parseFloat(reps) * (getSets(protocol) ?? 1);
};

/** Extracts the loads. */
export const getLoad = (protocol: string) => {
    if (!protocol.includes("x") && !protocol.includes("at")) return;
    const load = protocol.split(protocol.includes("at") ? "at" : "@")[1];
    if (load.includes("/")) {
        const splitValue = load.split("/").map(Number);
        return splitValue.reduce((a, b) => a + b);
    } else return parseFloat(load) * (getSets(protocol) ?? 1);
};

/** Extracts all other measures. */
export const getOtherMeasure = (protocol: string) => {
    const number = REGEX_NUMBER.exec(protocol);
    if (!number) return;
    return parseFloat(number[0]);
};

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/** Adds specified days to the date provided. */
export const addDays = (datetime: string, days: number) => {
    const d = new Date(datetime);
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
};
