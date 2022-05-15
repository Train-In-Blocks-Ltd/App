import Vue from "vue";
import VueAnalytics from "vue-analytics";
import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";
import VueMeta from "vue-meta";

import { InlineSvgPlugin } from "vue-inline-svg";

import Txt from "./components/elements/Txt.vue";
import TxtInput from "./components/elements/TxtInput.vue";
import TxtArea from "./components/elements/TxtArea.vue";
import Dropdown from "./components/elements/Dropdown.vue";
import DefaultButton from "./components/elements/DefaultButton.vue";
import Icon from "./components/elements/Icon.vue";
import IconButton from "./components/elements/IconButton.vue";
import LinkButton from "./components/elements/LinkButton.vue";
import Divider from "./components/elements/Divider.vue";
import RichEditor from "./components/extensive/RichEditor/index.vue";
import Wrapper from "./components/generic/Wrapper.vue";

import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import mixins from "./mixins";
import "./assets/tailwind.css";
loadProgressBar();

Vue.prototype.$axios = axios;

Vue.use(VueAnalytics, {
    id: "UA-167770206-2",
    router,
    debug: {
        sendHitTask: process.env.NODE_ENV === "production",
    },
    disabled: true,
});
Vue.use(InlineSvgPlugin);
Vue.use(VueMeta);

// Register component globally
Vue.component("Txt", Txt);
Vue.component("TxtInput", TxtInput);
Vue.component("TxtArea", TxtArea);
Vue.component("Dropdown", Dropdown);
Vue.component("DefaultButton", DefaultButton);
Vue.component("Icon", Icon);
Vue.component("IconButton", IconButton);
Vue.component("LinkButton", LinkButton);
Vue.component("Divider", Divider);
Vue.component("RichEditor", RichEditor);
Vue.component("Wrapper", Wrapper);

Vue.config.productionTip = false;

Vue.mixin({
    methods: mixins,
});

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>",
});
