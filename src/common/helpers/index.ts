/** Adds days to the date provided. */
export const addDays = (date: string, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}-${month}-${day}`;
};

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
