export default {
    /** Sets loading states */
    setLoading({ commit }, { loading, silentLoading, dontLeave }) {
        commit("setData", {
            attr: "loading",
            data: !!loading,
        });
        commit("setData", {
            attr: "silentLoading",
            data: !!silentLoading,
        });
        commit("setData", {
            attr: "dontLeave",
            data: !!dontLeave,
        });
    },

    /** Opens a global modal. */
    openModal({ commit }, { name, size, persist }) {
        commit("setData", {
            attr: "modalContent",
            data: name,
        });
        commit("setData", {
            attr: "modalSize",
            data: size ?? "sm",
        });
        commit("setData", {
            attr: "modalPersist",
            data: persist,
        });
        commit("setData", {
            attr: "modalOpen",
            data: true,
        });
    },

    /** Closes and resets the global modal. */
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
        commit("setData", {
            attr: "modalPersist",
            data: false,
        });
    },

    /** Opens the response pop-up. */
    openResponsePopUp({ commit }, { title, description, persist, backdrop }) {
        commit("setData", {
            attr: "responseOpen",
            data: true,
        });
        commit("setData", {
            attr: "responseTitle",
            data: title,
        });
        commit("setData", {
            attr: "responseDescription",
            data: description,
        });
        commit("setData", {
            attr: "responsePersist",
            data: persist,
        });
        commit("setData", {
            attr: "responseBackdrop",
            data: backdrop,
        });
    },

    /** Closes the response pop-up. */
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

    /** Opens the confirm pop-up. */
    async openConfirmPopUp({ commit }, { title, text }) {
        return new Promise((resolve) => {
            commit("setData", {
                attr: "confirmPromise",
                data: resolve,
            });
            commit("setData", {
                attr: "confirmTitle",
                data: title,
            });
            commit("setData", {
                attr: "confirmText",
                data: text,
            });
        });
    },

    /** Closes the confirm pop-up. */
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

    /** Opens the upload pop-up */
    async openUploadPopUp({ commit }, { title, text }) {
        return new Promise((resolve) => {
            commit("setData", {
                attr: "uploadPromise",
                data: resolve,
            });
            commit("setData", {
                attr: "uploadTitle",
                data: title,
            });
            commit("setData", {
                attr: "uploadText",
                data: text,
            });
        });
    },

    /** Closes the upload pop-up */
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

    /** Opens the text input pop-up */
    async openTxtInputPopUp({ commit }, { title, text, label, placeholder }) {
        return new Promise((resolve) => {
            commit("setData", {
                attr: "txtInputPromise",
                data: resolve,
            });
            commit("setData", {
                attr: "txtInputTitle",
                data: title,
            });
            commit("setData", {
                attr: "txtInputText",
                data: text,
            });
            commit("setData", {
                attr: "txtInputLabel",
                data: label,
            });
            commit("setData", {
                attr: "txtInputPlaceholder",
                data: placeholder,
            });
        });
    },

    /** Closes the text input pop-up */
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

    /** Changes the state of the selected checkbox. */
    toggleCheckbox({ state, commit }, id) {
        commit("setData", {
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
