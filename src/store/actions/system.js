export default {
    /** Opens the upload pop-up */
    async openUploadPopUp({ commit }, { title, text }) {
        return new Promise((resolve) => {
            commit("SET_DATA", {
                attr: "uploadPromise",
                data: resolve,
            });
            commit("SET_DATA", {
                attr: "uploadTitle",
                data: title,
            });
            commit("SET_DATA", {
                attr: "uploadText",
                data: text,
            });
        });
    },

    /** Closes the upload pop-up */
    closeUploadPopUp({ commit }) {
        commit("SET_DATA", {
            attr: "uploadPromise",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "uploadTitle",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "uploadText",
            data: undefined,
        });
    },

    /** Opens the text input pop-up */
    async openTxtInputPopUp({ commit }, { title, text, label, placeholder }) {
        return new Promise((resolve) => {
            commit("SET_DATA", {
                attr: "txtInputPromise",
                data: resolve,
            });
            commit("SET_DATA", {
                attr: "txtInputTitle",
                data: title,
            });
            commit("SET_DATA", {
                attr: "txtInputText",
                data: text,
            });
            commit("SET_DATA", {
                attr: "txtInputLabel",
                data: label,
            });
            commit("SET_DATA", {
                attr: "txtInputPlaceholder",
                data: placeholder,
            });
        });
    },

    /** Closes the text input pop-up */
    closeTxtInputPopUp({ commit }) {
        commit("SET_DATA", {
            attr: "txtInputPromise",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "txtInputTitle",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "txtInputText",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "txtInputLabel",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "txtInputValue",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "txtInputPlaceholder",
            data: undefined,
        });
    },
};
