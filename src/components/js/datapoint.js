class DataPoint {
    constructor(parent, dataPacket, returnDataType) {
        this.parent = parent;
        this.sessionName = dataPacket.sessionName;
        this.sessionDate = dataPacket.sessionDate;
        this.exerciseName = dataPacket.exerciseName;
        this.protocol = dataPacket.exerciseProtocol.replace(/\s/g, "");
        this.returnDataType = returnDataType;
        this.regexSetsReps = /(\d*)x((\d*\/*)*)/gi;
        this.regexLoad = /at\s*((\d\.*\/*)*)\s*\w*/gi;
        this.regexGetNumber = /[0-9.]+/gi;
    }

    /**
     * Indexes the correct function to extract for each type of data.
     * @returns The extracted value.
     */
    get calculate() {
        switch (this.returnDataType) {
        case "sets":
            return this.getSets();
        case "reps":
            return this.getReps();
        case "load":
            return this.getLoad();
        case "volume":
            return this.getReps() * this.getLoad();
        case "other":
            return this.getOtherMeasure();
        }
    }

    /**
     * Extracts the sets.
     * @returns The extracted value.
     */
    getSets() {
        let returnValue;
        let finder;
        while ((finder = this.regexSetsReps.exec(this.protocol)) !== null) {
            if (finder.index === this.regexSetsReps.lastIndex) {
                this.regexSetsReps.lastIndex++;
            }
            finder.forEach((setsMatch, setsIndex) => {
                if (setsIndex === 1) {
                    returnValue = parseFloat(setsMatch);
                }
            });
        }
        return returnValue;
    }

    /**
     * Extracts the reps.
     * @returns The extracted value.
     */
    getReps() {
        const NUM_OF_SETS = this.getSets(false);
        let returnValue;
        let repsFinder;
        while ((repsFinder = this.regexSetsReps.exec(this.protocol)) !== null) {
            if (repsFinder.index === this.regexSetsReps.lastIndex) {
                this.regexSetsReps.lastIndex++;
            }
            repsFinder.forEach((repsMatch, repsIndex) => {
                if (repsIndex === 2) {
                    if (repsMatch.includes("/")) {
                        const SPLIT_VALUE = repsMatch.split("/").map(Number);
                        returnValue = SPLIT_VALUE.reduce((a, b) => a + b);
                        const LARGEST = Math.max(...SPLIT_VALUE);
                        const SMALLEST = Math.min(...SPLIT_VALUE);
                        this.parent.largestValue =
                            this.parent.largestValue === null
                                ? LARGEST
                                : this.parent.largestValue < LARGEST
                                    ? LARGEST
                                    : this.parent.largestValue;
                        this.parent.smallestValue =
                            this.parent.smallestValue === null
                                ? SMALLEST
                                : this.parent.smallestValue > SMALLEST
                                    ? SMALLEST
                                    : this.parent.smallestValue;
                    } else {
                        returnValue = parseFloat(repsMatch) * NUM_OF_SETS;
                        this.parent.largestValue =
                            this.parent.largestValue === null
                                ? parseFloat(repsMatch)
                                : this.parent.largestValue <
                                  parseFloat(repsMatch)
                                    ? parseFloat(repsMatch)
                                    : this.parent.largestValue;
                        this.parent.smallestValue =
                            this.parent.smallestValue === null
                                ? parseFloat(repsMatch)
                                : this.parent.smallestValue >
                                  parseFloat(repsMatch)
                                    ? parseFloat(repsMatch)
                                    : this.parent.smallestValue;
                    }
                }
            });
        }
        return returnValue;
    }

    /**
     * Extracts the loads.
     * @returns The extracted value.
     */
    getLoad() {
        const NUM_OF_SETS = this.getSets(false);
        let returnValue;
        let loadFinder;
        while ((loadFinder = this.regexLoad.exec(this.protocol)) !== null) {
            if (loadFinder.index === this.regexLoad.lastIndex) {
                this.regexLoad.lastIndex++;
            }
            loadFinder.forEach((loadMatch, loadIndex) => {
                if (loadIndex === 1) {
                    if (loadMatch.includes("/")) {
                        const SPLIT_VALUE = loadMatch.split("/").map(Number);
                        returnValue = SPLIT_VALUE.reduce((a, b) => a + b);
                        const LARGEST = Math.max(...SPLIT_VALUE);
                        const SMALLEST = Math.min(...SPLIT_VALUE);
                        this.parent.largestValue =
                            this.parent.largestValue === null
                                ? LARGEST
                                : this.parent.largestValue < LARGEST
                                    ? LARGEST
                                    : this.parent.largestValue;
                        this.parent.smallestValue =
                            this.parent.smallestValue === null
                                ? SMALLEST
                                : this.parent.smallestValue > SMALLEST
                                    ? SMALLEST
                                    : this.parent.smallestValue;
                    } else {
                        returnValue = parseFloat(loadMatch) * NUM_OF_SETS;
                        this.parent.largestValue =
                            this.parent.largestValue === null
                                ? parseFloat(loadMatch)
                                : this.parent.largestValue <
                                  parseFloat(loadMatch)
                                    ? parseFloat(loadMatch)
                                    : this.parent.largestValue;
                        this.parent.smallestValue =
                            this.parent.smallestValue === null
                                ? parseFloat(loadMatch)
                                : this.parent.smallestValue >
                                  parseFloat(loadMatch)
                                    ? parseFloat(loadMatch)
                                    : this.parent.smallestValue;
                    }
                }
            });
        }
        return returnValue;
    }

    /**
     * Extracts all other measures.
     * @returns The extracted value.
     */
    getOtherMeasure() {
        let returnValue;
        let numberFinder;
        while (
            (numberFinder = this.regexGetNumber.exec(this.protocol)) !== null
        ) {
            if (numberFinder.index === this.regexGetNumber.lastIndex) {
                this.regexGetNumber.lastIndex++;
            }
            numberFinder.forEach((numberMatch) => {
                returnValue = parseFloat(numberMatch);
            });
        }
        return returnValue;
    }
}

module.exports = DataPoint;
