export default {
    /**
     * Toggles body scroll.
     * @param {boolean} state
     */
    willBodyScroll(state) {
        const BODY = document.getElementsByTagName("body")[0];
        state
            ? (BODY.style.overflow = "auto")
            : (BODY.style.overflow = "hidden");
    },

    /**
     * Extracts anything that is wrapped in square brackets
     * @param {string} sessionName - The title or name of the session.
     * @param {string} text - The body or notes of the session.
     * @param {date} sessionDate - The date of the session.
     * @returns Data packets of exercises
     */
    pull_protocols(sessionName, text, sessionDate) {
        const REGEX_EXTRACT_EXERCISES = /\[\s*(.*?)\s*:\s*(.*?)\]/gi;
        const REGEX_EXTRACT_EXERCISES_NEW =
            /<div data-type="protocol-item">\s*(.*?)\s*:\s*(.*?)<\/div>/gi;
        const RETURN_PACKETS = [];
        let finderNew;
        while ((finderNew = REGEX_EXTRACT_EXERCISES_NEW.exec(text)) !== null) {
            if (finderNew.index === REGEX_EXTRACT_EXERCISES_NEW.lastIndex) {
                REGEX_EXTRACT_EXERCISES_NEW.lastIndex++;
            }
            const PACKET_BUILDER = {
                sessionName,
                sessionDate,
                exerciseName: null,
                exerciseProtocol: null,
            };
            finderNew.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                    PACKET_BUILDER.exerciseName = match.replace(
                        /<[^>]*>?/gim,
                        ""
                    );
                } else if (groupIndex === 2) {
                    PACKET_BUILDER.exerciseProtocol = match.replace(
                        /<[^>]*>?/gim,
                        ""
                    );
                }
            });
            RETURN_PACKETS.push(PACKET_BUILDER);
        }
        let finderOld;
        const HTML_REMOVED_TAGS = text.replace(/<[^>]*>?/gim, "");
        while (
            (finderOld = REGEX_EXTRACT_EXERCISES.exec(HTML_REMOVED_TAGS)) !==
            null
        ) {
            if (finderOld.index === REGEX_EXTRACT_EXERCISES.lastIndex) {
                REGEX_EXTRACT_EXERCISES.lastIndex++;
            }
            const PACKET_BUILDER = {
                sessionName,
                sessionDate,
                exerciseName: null,
                exerciseProtocol: null,
            };
            finderOld.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                    PACKET_BUILDER.exerciseName = match;
                } else if (groupIndex === 2) {
                    PACKET_BUILDER.exerciseProtocol = match;
                }
            });
            RETURN_PACKETS.push(PACKET_BUILDER);
        }
        return RETURN_PACKETS;
    },

    /**
     * Processes the HTML before preview or injection to expected standards.
     * @param {string} html - The HTML input or to be displayed.
     * @param {boolean} rmBrackets - To show the square brackets or not in the processed returned HTML.
     * @returns The processed html ready to view or injected into a editor.
     */
    updateHTML(html, rmBrackets) {
        if (html === null) {
            return html;
        }
        const REGEX_IFRAME = /<iframe[^>]+src="([^"]+)"><\/iframe>/gi;
        let m;
        const TO_UPDATE_ARRAY = [];
        // Finds all iframes
        while ((m = REGEX_IFRAME.exec(html)) !== null) {
            if (m.index === REGEX_IFRAME.lastIndex) {
                REGEX_IFRAME.lastIndex++;
            }
            const MATCH_EXTRACT_COLLECTOR = [];
            m.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                    MATCH_EXTRACT_COLLECTOR.push(match);
                    TO_UPDATE_ARRAY.push(MATCH_EXTRACT_COLLECTOR);
                } else {
                    MATCH_EXTRACT_COLLECTOR.push(match);
                }
            });
        }
        // Removes iframes
        TO_UPDATE_ARRAY.forEach((item) => {
            html = html.replace(
                item[0],
                `<a href="${item[1]}" rel="noopener noreferrer nofollow">Watch video</a>`
            );
        });
        html = rmBrackets ? html.replace(/[[\]]/g, "") : html;
        return html
            .replace('onclick="resize(this)"', "")
            .replace(/contenteditable="true"/gi, "");
    },

    /**
     * @returns Today's date in YYYY-MM-DD.
     */
    today() {
        const DATE = new Date();
        const YEAR = DATE.getFullYear();
        const MONTH = String(DATE.getMonth() + 1).padStart(2, "0");
        const DAY = String(DATE.getDate()).padStart(2, "0");
        return `${YEAR}-${MONTH}-${DAY}`;
    },

    /**
     * @returns The current time in HH:MM.
     */
    timeNow() {
        const DATE = new Date();
        const HOUR = String(DATE.getHours()).padStart(2, "0");
        const MIN = String(DATE.getMinutes()).padStart(2, "0");
        return `${HOUR}:${MIN}`;
    },

    /**
     * Takes in the date and returns the day of the week.
     * @param {date} date - The day of the week
     * @returns The day of the week.
     */
    day(date) {
        const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return WEEKDAY[new Date(date).getDay()];
    },

    /**
     * Process into a short-form datetime.
     * @param {datetime} datetime - The input datetime.
     * @returns Short-form datetime.
     */
    shortTime(datetime) {
        const TIME = new Date(datetime.replace(/-/g, "/"));
        return `${TIME.getHours()}:${
            (TIME.getMinutes() < 10 ? "0" : "") + TIME.getMinutes()
        }`;
    },

    /**
     * Adds days to the date provided.
     * @param {date} date - The date to add days to.
     * @param {integer} days - The number of days to add to date.
     * @returns The processed date.
     */
    addDays(date, days) {
        const DATE = new Date(date);
        DATE.setDate(DATE.getDate() + days);
        const YEAR = DATE.getFullYear();
        const MONTH = DATE.getMonth() + 1;
        const DAY = DATE.getDate();
        return `${YEAR}-${MONTH}-${DAY}`;
    },

    /**
     * Sorts the sessions of a plan.
     * @param {object} plan - The plan of which sessions would be sorted.
     * @returns The plan with sorted sessions by date.
     */
    sort_sessions(plan) {
        if (plan.sessions) {
            plan.sessions.sort((a, b) => {
                return Number(new Date(a.date)) - Number(new Date(b.date));
            });
        }
        return plan;
    },

    /**
     * Gives proper casing to text.
     * @param {string} string - The text to receive proper casing.
     * @returns The proper-cased text.
     */
    proper_case(string) {
        const SENTENCE = string.toLowerCase().split(" ");
        for (let i = 0; i < SENTENCE.length; i++) {
            SENTENCE[i] = SENTENCE[i][0].toUpperCase() + SENTENCE[i].slice(1);
        }
        return SENTENCE.join(" ");
    },

    /**
     * Determines if a colour has acceptable contrast and returns ideal colour.
     * @param {string} hex - The current colour.
     * @returns The appropriate text colour.
     */
    accessible_colors(hex) {
        if (hex !== undefined) {
            hex = hex.replace("#", "");
            const RED = parseInt(hex.substring(0, 2), 16);
            const GREEN = parseInt(hex.substring(2, 4), 16);
            const BLUE = parseInt(hex.substring(4, 6), 16);
            const RESULT =
                ((RED * 299 + GREEN * 587 + BLUE * 114) / 1000 - 128) * -1000;
            return `rgb(${RESULT}, ${RESULT}, ${RESULT})`;
        }
    },

    /**
     * Checks if the booking is in the past.
     * @param {object} booking- The booking.
     * @returns A boolean of if the booking is in the past.
     */
    isInThePast(booking) {
        return new Date(booking.datetime) < new Date();
    },

    /**
     * Make a data have fixed decimal places.
     * @param {*} data - The data to have decimals.
     * @param {integer} dp - The number of decimal places.
     * @returns The data with specified decimal places.
     */
    makeDecimals(data, dp) {
        return parseFloat(data).toFixed(dp);
    },
};
