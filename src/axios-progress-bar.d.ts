import { AxiosInstance } from "axios";

declare module "axios-progress-bar" {
    function loadProgressBar(config: any, instance: any);
    export { loadProgressBar };
}
