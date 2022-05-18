import { Component, Vue } from "vue-property-decorator";

export default class GeneralMixins extends Vue {
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
    accessible_colors(hex: string) {
        if (hex !== undefined) {
            hex = hex.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const result = ((r * 299 + g * 587 + b * 114) / 1000 - 128) * -1000;
            return `rgb(${r}, ${r}, ${r})`;
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
}
