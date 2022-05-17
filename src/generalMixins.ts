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
}
