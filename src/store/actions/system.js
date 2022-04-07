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

    /** Opens the response pop-up. */
    openResponsePopUp({ commit }, { title, description, persist, backdrop }) {
        commit("SET_DATA", {
            attr: "responseOpen",
            data: true,
        });
        commit("SET_DATA", {
            attr: "responseTitle",
            data: title,
        });
        commit("SET_DATA", {
            attr: "responseDescription",
            data: description,
        });
        commit("SET_DATA", {
            attr: "responsePersist",
            data: persist,
        });
        commit("SET_DATA", {
            attr: "responseBackdrop",
            data: backdrop,
        });
    },

    /** Closes the response pop-up. */
    closeResponsePopUp({ commit }) {
        commit("SET_DATA", {
            attr: "responseOpen",
            data: false,
        });
        commit("SET_DATA", {
            attr: "responseTitle",
            data: null,
        });
        commit("SET_DATA", {
            attr: "responseDescription",
            data: null,
        });
        commit("SET_DATA", {
            attr: "responsePersist",
            data: false,
        });
        commit("SET_DATA", {
            attr: "responseBackdrop",
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

    /** Gets all the data for the trainer-user's session. */
    async getHighLevelData({ dispatch, commit, state }) {
        // Main data call
        const RESPONSE = await this._vm.$axios.get(
            `https://api.traininblocks.com/v2/${state.claims.sub}`
        );

        // Sets clients
        const SORTED_CLIENTS = RESPONSE.data[0].sort((a, b) => {
            const NAME_A = a.name.toUpperCase();
            const NAME_B = b.name.toUpperCase();
            return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
        });
        commit("SET_DATA", {
            attr: "clients",
            data: SORTED_CLIENTS,
        });

        // Sets archive
        const SORTED_ARCHIVE_CLIENTS = RESPONSE.data[1].sort((a, b) => {
            const NAME_A = a.name.toUpperCase();
            const NAME_B = b.name.toUpperCase();
            return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
        });
        commit("SET_DATA_DEEP", {
            attrParent: "archive",
            attrChild: "clients",
            data: SORTED_ARCHIVE_CLIENTS,
        });

        // Sets templates and portfolio
        commit("SET_DATA", {
            attr: "templates",
            data: RESPONSE.data[2],
        });

        if (RESPONSE.data[3].length === 0) {
            await dispatch("createPortfolio");
        } else {
            commit("SET_DATA", {
                attr: "portfolio",
                data: { ...RESPONSE.data[3][0] },
            });
        }

        // Sets bookings
        const SORTED_BOOKINGS = RESPONSE.data[4].sort((a, b) => {
            return new Date(a.datetime) - new Date(b.datetime);
        });
        if (state.claims.email === "demo@traininblocks.com") {
            const TODAY = new Date();
            SORTED_BOOKINGS.forEach((booking) => {
                const NEW_DATE = new Date(
                    TODAY.getFullYear(),
                    TODAY.getMonth(),
                    TODAY.getDate() + 7
                );
                const OLD_DATETIME = booking.datetime.split(" ");
                booking.datetime = [
                    `${NEW_DATE.getFullYear()}-${String(
                        NEW_DATE.getMonth() + 1
                    ).padStart(2, "0")}-${String(NEW_DATE.getDate()).padStart(
                        2,
                        "0"
                    )}`,
                    OLD_DATETIME[1],
                ].join(" ");
            });
        }
        commit("SET_DATA", {
            attr: "bookings",
            data: SORTED_BOOKINGS,
        });

        // Sets products
        commit("SET_DATA", {
            attr: "products",
            data: RESPONSE.data[5],
        });
    },

    /** Changes the state of the selected checkbox. */
    toggleCheckbox({ state, commit }, id) {
        commit("SET_DATA", {
            attr: "selectedIds",
            data: !state.selectedIds.includes(id)
                ? [...state.selectedIds, id]
                : state.selectedIds.filter((selectedId) => selectedId !== id),
        });
    },

    /** Processes captured error and sends to Jira. */
    async resolveError({ state, dispatch }, msg) {
        if (state.claims.user_type !== "Admin") {
            await this._vm.$axios.post("/.netlify/functions/error", {
                msg,
                claims: state.claims,
            });
        }
        dispatch("setLoading", false);
        dispatch("openResponsePopUp", {
            title: "ERROR: this problem has been reported to our developers",
            description:
                msg.toString() !== "Error: Network Error"
                    ? msg.toString()
                    : "You may be offline. We'll try that request again once you've reconnected",
            persist: true,
            backdrop: true,
        });
    },
};
