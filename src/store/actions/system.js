export default {
    /** Sets loading states */
    setLoading(
        { commit },
        { loading, silentLoading, dontLeave, disableButtons }
    ) {
        commit("SET_DATA", {
            attr: "loading",
            data: !!loading,
        });
        commit("SET_DATA", {
            attr: "silentLoading",
            data: !!silentLoading,
        });
        commit("SET_DATA", {
            attr: "dontLeave",
            data: !!dontLeave,
        });
        commit("SET_DATA", {
            attr: "disableButtons",
            data: !!disableButtons,
        });
    },

    /** Opens a global modal. */
    openModal({ commit }, { name, size, persist }) {
        commit("SET_DATA", {
            attr: "modalContent",
            data: name,
        });
        commit("SET_DATA", {
            attr: "modalSize",
            data: size ?? "sm",
        });
        commit("SET_DATA", {
            attr: "modalPersist",
            data: persist,
        });
        commit("SET_DATA", {
            attr: "modalOpen",
            data: true,
        });
    },

    /** Closes and resets the global modal. */
    closeModal({ commit }) {
        commit("SET_DATA", {
            attr: "previewTitle",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "previewHTML",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "modalSize",
            data: null,
        });
        commit("SET_DATA", {
            attr: "modalOpen",
            data: false,
        });
        commit("SET_DATA", {
            attr: "modalContent",
            data: null,
        });
        commit("SET_DATA", {
            attr: "modalPersist",
            data: false,
        });
    },

    /** Opens the confirm pop-up. */
    async openConfirmPopUp({ commit }, { title, text }) {
        return new Promise((resolve) => {
            commit("SET_DATA", {
                attr: "confirmPromise",
                data: resolve,
            });
            commit("SET_DATA", {
                attr: "confirmTitle",
                data: title,
            });
            commit("SET_DATA", {
                attr: "confirmText",
                data: text,
            });
        });
    },

    /** Closes the confirm pop-up. */
    closeConfirmPopUp({ commit }) {
        commit("SET_DATA", {
            attr: "confirmPromise",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "confirmTitle",
            data: undefined,
        });
        commit("SET_DATA", {
            attr: "confirmText",
            data: undefined,
        });
    },

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
