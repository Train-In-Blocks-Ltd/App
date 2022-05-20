/** Adds days to the date provided. */
export const addDays = (date: string, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}-${month}-${day}`;
};

export const REGEX_SETS_REPS = /(\d*)x((\d*\/*)*)/gi;
export const REGEX_LOAD = /at\s*((\d\.*\/*)*)\s*\w*/gi;
export const REGEX_NUMBER = /[0-9.]+/gi;

/** Extracts the sets. */
export const getSets = (protocol: string) => {
    let finder;
    while ((finder = REGEX_SETS_REPS.exec(protocol)) !== null) {
        if (finder.index === REGEX_SETS_REPS.lastIndex)
            REGEX_SETS_REPS.lastIndex++;
        return parseFloat(finder[1]);
    }
};

/** Extracts the reps. */
export const getReps = (protocol: string) => {
    let finder;
    while ((finder = REGEX_SETS_REPS.exec(protocol)) !== null) {
        if (finder.index === REGEX_SETS_REPS.lastIndex)
            REGEX_SETS_REPS.lastIndex++;

        const match = finder[2];
        if (match.includes("/")) {
            const splitValue = match.split("/").map(Number);
            return splitValue.reduce((a, b) => a + b);
        } else return parseFloat(match) * (getSets(protocol) ?? 1);
    }
};

/** Extracts the loads. */
export const getLoad = (protocol: string) => {
    let finder;
    while ((finder = REGEX_LOAD.exec(protocol)) !== null) {
        if (finder.index === REGEX_LOAD.lastIndex) REGEX_LOAD.lastIndex++;

        const match = finder[1];
        if (match.includes("/")) {
            const splitValue = match.split("/").map(Number);
            return splitValue.reduce((a, b) => a + b);
        } else return parseFloat(match) * (getSets(protocol) ?? 1);
    }
};

/** Extracts all other measures. */
export const getOtherMeasure = (protocol: string) => {
    let finder;
    while ((finder = REGEX_NUMBER.exec(protocol)) !== null) {
        if (finder.index === REGEX_NUMBER.lastIndex) REGEX_NUMBER.lastIndex++;

        return parseFloat(finder[0]);
    }
};
