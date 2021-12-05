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
          `${NEW_DATE.getFullYear()}-${String(NEW_DATE.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(NEW_DATE.getDate()).padStart(2, "0")}`,
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
};
