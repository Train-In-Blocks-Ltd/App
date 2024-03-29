import { Component, Vue } from "vue-property-decorator";
import { Booking, DarkmodeType, Protocol } from "./common/types";

@Component
export default class MainMixins extends Vue {
    /** Today's date in YYYY-MM-DD. */
    today() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /** The current time in HH:MM. */
    timeNow() {
        const d = new Date();
        const hour = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${hour}:${min}`;
    }

    /** Determines if a colour has acceptable contrast and returns ideal colour. */
    getAccessibleColor(hex: string) {
        if (hex !== undefined) {
            hex = hex.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const result = ((r * 299 + g * 587 + b * 114) / 1000 - 128) * -1000;
            return `rgb(${result}, ${result}, ${result})`;
        }
    }

    /** Processes the HTML before preview or injection to expected standards.*/
    updateHTML(html: string, rmBrackets: boolean) {
        const REGEX_IFRAME = /<iframe[^>]+src="([^"]+)"><\/iframe>/gi;
        let m;
        const TO_UPDATE_ARRAY: string[][] = [];
        while ((m = REGEX_IFRAME.exec(html)) !== null) {
            if (m.index === REGEX_IFRAME.lastIndex) {
                REGEX_IFRAME.lastIndex++;
            }
            const MATCH_EXTRACT_COLLECTOR: string[] = [];
            m.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                    MATCH_EXTRACT_COLLECTOR.push(match);
                    TO_UPDATE_ARRAY.push(MATCH_EXTRACT_COLLECTOR);
                } else {
                    MATCH_EXTRACT_COLLECTOR.push(match);
                }
            });
        }
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
    }

    /** Extracts anything that is wrapped in square brackets */
    pullProtocols(name: string, notes: string, date: string): Protocol[] {
        const protocolRegex = /\[\s*(.*?)\s*:\s*(.*?)\]/gi;
        const protocols: Protocol[] = [];
        let finder;
        const noHTMLNotes = notes.replace(/<[^>]*>?/gim, "");
        while ((finder = protocolRegex.exec(noHTMLNotes)) !== null) {
            if (finder.index === protocolRegex.lastIndex)
                protocolRegex.lastIndex++;

            const data: Protocol = {
                name,
                date,
                exercise: finder[1],
                protocol: finder[2],
            };
            protocols.push(data);
        }
        return protocols;
    }

    /** Adds specified days to the date provided. */
    addDays(datetime: string, days: number) {
        const d = new Date(datetime.replace(/-/g, "/"));
        d.setDate(d.getDate() + days);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const date = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

    /** Process into a short-form datetime. */
    shortTime(datetime: string) {
        const time = new Date(datetime.replace(/-/g, "/"));
        return `${time.getHours()}:${
            (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
        }`;
    }

    /** Takes in the date and returns the day of the week. */
    day(date: string) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[new Date(date.replace(/-/g, "/")).getDay()];
    }

    /** Checks if the booking is in the past. */
    isInThePast(booking: Booking) {
        return new Date(booking.datetime.replace(/-/g, "/")) < new Date();
    }

    /** Gives darkmode theme to the app. */
    darkmode(mode?: DarkmodeType) {
        const MATCHED_MEDIA =
            window.matchMedia("(prefers-color-scheme)") || false;
        if (mode === "dark") document.documentElement.classList.add("dark");
        else if (mode === "system" && !!MATCHED_MEDIA) {
            this.darkmode(
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
            );
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addListener((e) => {
                    this.darkmode(e.matches ? "dark" : "light");
                });
        } else document.documentElement.classList.remove("dark");
    }
}
