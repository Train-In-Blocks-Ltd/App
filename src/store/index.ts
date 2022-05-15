import Vue from "vue";
import Vuex from "vuex";

import appState from "./modules/appState";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {},
    modules: {
        appState,
    },
});
