import Vue from "vue";
import VueAnalytics from "vue-analytics";
import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";
import VueMeta from "vue-meta";

import { InlineSvgPlugin } from "vue-inline-svg";

import Skeleton from "@/components/Skeleton";
import ConfirmPopUp from "@/components/ConfirmPopUp";
import InputPopUp from "@/components/InputPopUp";
import GlobalOverlay from "@/components/GlobalOverlay";
import Txt from "@/components/elements/Txt";
import TxtInput from "@/components/elements/TxtInput";
import DefaultButton from "@/components/elements/DefaultButton";
import IconButton from "@/components/elements/IconButton";
import Wrapper from "@/components/generic/Wrapper";

import App from "./App";
import router from "./router";
import { store } from "./store/store";
import mixins from "./mixins";
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
Vue.component("Skeleton", Skeleton);
Vue.component("ConfirmPopUp", ConfirmPopUp);
Vue.component("InputPopUp", InputPopUp);
Vue.component("GlobalOverlay", GlobalOverlay);
Vue.component("Txt", Txt);
Vue.component("TxtInput", TxtInput);
Vue.component("DefaultButton", DefaultButton);
Vue.component("IconButton", IconButton);
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
