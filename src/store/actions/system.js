export default {
    /** Ends all loading. */
    endLoading({ commit }) {
        commit("setData", {
            attr: "loading",
            data: false,
        });
        commit("setData", {
            attr: "silentLoading",
            data: false,
        });
        commit("setData", {
            attr: "dontLeave",
            data: false,
        });
    },

    /**
     * Opens a global modal
     * @param {string} payload.name - The name of the modal.
     * @param {string} payload.size - The size of the modal.
     */
    openModal({ commit }, payload) {
        commit("setData", {
            attr: "modalSize",
            data: payload.size ?? "sm",
        });
        commit("setData", {
            attr: "modalOpen",
            data: true,
        });
        commit("setData", {
            attr: "modalContent",
            data: payload.name,
        });
    },

    /**
     * Closes and resets the global modal.
     */
    closeModal({ commit }) {
        commit("setData", {
            attr: "previewHTML",
            data: undefined,
        });
        commit("setData", {
            attr: "modalSize",
            data: null,
        });
        commit("setData", {
            attr: "modalOpen",
            data: false,
        });
        commit("setData", {
            attr: "modalContent",
            data: null,
        });
    },

    /**
     * Opens the response pop-up
     * @param {string} payload.title - The title of the pop-up.
     * @param {string} payload.description - The body text of the pop-up.
     * @param {boolean} payload.persist - Whether it will disappear automatically after some time.
     * @param {boolean} payload.backdrop - Whether it will have a dark backdrop.
     */
    openResponsePopUp({ commit }, payload) {
        commit("setData", {
            attr: "responseOpen",
            data: true,
        });
        if (payload.title)
            commit("setData", {
                attr: "responseTitle",
                data: payload.title,
            });
        if (payload.description)
            commit("setData", {
                attr: "responseDescription",
                data: payload.description,
            });
        if (payload.persist)
            commit("setData", {
                attr: "responsePersist",
                data: payload.persist,
            });
        if (payload.backdrop)
            commit("setData", {
                attr: "responseBackdrop",
                data: payload.backdrop,
            });
    },

    closeResponsePopUp({ commit }) {
        commit("setData", {
            attr: "responseOpen",
            data: false,
        });
        commit("setData", {
            attr: "responseTitle",
            data: null,
        });
        commit("setData", {
            attr: "responseDescription",
            data: null,
        });
        commit("setData", {
            attr: "responsePersist",
            data: false,
        });
        commit("setData", {
            attr: "responseBackdrop",
            data: false,
        });
    },

    async openConfirmPopUp({ commit }, payload) {
        return new Promise((resolve) => {
            commit("setData", {
                attr: "confirmPromise",
                data: resolve,
            });
            if (payload.title)
                commit("setData", {
                    attr: "confirmTitle",
                    data: payload.title,
                });
            if (payload.text)
                commit("setData", {
                    attr: "confirmText",
                    data: payload.text,
                });
        });
    },

    closeConfirmPopUp({ commit }) {
        commit("setData", {
            attr: "confirmPromise",
            data: undefined,
        });
        commit("setData", {
            attr: "confirmTitle",
            data: undefined,
        });
        commit("setData", {
            attr: "confirmText",
            data: undefined,
        });
    },

    async openUploadPopUp({ commit }, payload) {
        return new Promise((resolve) => {
            commit("setData", {
                attr: "uploadPromise",
                data: resolve,
            });
            if (payload.title)
                commit("setData", {
                    attr: "uploadTitle",
                    data: payload.title,
                });
            if (payload.text)
                commit("setData", {
                    attr: "uploadText",
                    data: payload.text,
                });
        });
    },

    closeUploadPopUp({ commit }) {
        commit("setData", {
            attr: "uploadPromise",
            data: undefined,
        });
        commit("setData", {
            attr: "uploadTitle",
            data: undefined,
        });
        commit("setData", {
            attr: "uploadText",
            data: undefined,
        });
    },

    async openTxtInputPopUp({ commit }, payload) {
        return new Promise((resolve) => {
            commit("setData", {
                attr: "txtInputPromise",
                data: resolve,
            });
            if (payload.title)
                commit("setData", {
                    attr: "txtInputTitle",
                    data: payload.title,
                });
            if (payload.text)
                commit("setData", {
                    attr: "txtInputText",
                    data: payload.text,
                });
            if (payload.label)
                commit("setData", {
                    attr: "txtInputLabel",
                    data: payload.label,
                });
            if (payload.placeholder)
                commit("setData", {
                    attr: "txtInputPlaceholder",
                    data: payload.placeholder,
                });
        });
    },

    closeTxtInputPopUp({ commit }) {
        commit("setData", {
            attr: "txtInputPromise",
            data: undefined,
        });
        commit("setData", {
            attr: "txtInputTitle",
            data: undefined,
        });
        commit("setData", {
            attr: "txtInputText",
            data: undefined,
        });
        commit("setData", {
            attr: "txtInputLabel",
            data: undefined,
        });
        commit("setData", {
            attr: "txtInputValue",
            data: undefined,
        });
        commit("setData", {
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
        commit("setData", {
            attr: "clients",
            data: SORTED_CLIENTS,
        });

        // Sets archive
        const SORTED_ARCHIVE_CLIENTS = RESPONSE.data[1].sort((a, b) => {
            const NAME_A = a.name.toUpperCase();
            const NAME_B = b.name.toUpperCase();
            return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
        });
        commit("setDataDeep", {
            attrParent: "archive",
            attrChild: "clients",
            data: SORTED_ARCHIVE_CLIENTS,
        });

        // Sets templates and portfolio
        commit("setData", {
            attr: "templates",
            data: RESPONSE.data[2],
        });

        if (RESPONSE.data[3].length === 0) {
            await dispatch("createPortfolio");
        } else {
            commit("setData", {
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
        commit("setData", {
            attr: "bookings",
            data: SORTED_BOOKINGS,
        });

        // Sets products
        commit("setData", {
            attr: "products",
            data: RESPONSE.data[5],
        });
    },

    toggleCheckbox({ state, commit }, id) {
        commit("setData", {
            attr: "selectedIds",
            data: !state.selectedIds.includes(id)
                ? [...state.selectedIds, id]
                : state.selectedIds.filter((selectedId) => selectedId !== id),
        });
    },

    /**
     * Processes captured error and sends to Jira.
     * @param msg - The error text.
     */
    async resolveError({ state, dispatch }, msg) {
        if (state.claims.user_type !== "Admin") {
            await this._vm.$axios.post("/.netlify/functions/error", {
                msg,
                claims: state.claims,
            });
        }
        dispatch("endLoading");
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
