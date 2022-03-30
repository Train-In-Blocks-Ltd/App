export default {
    /** Creates a portfolio. */
    async createPortfolio({ dispatch, state }) {
        await this._vm.$axios.post(
            "https://api.traininblocks.com/v2/portfolio",
            {
                pt_id: state.claims.sub,
                trainer_name: "",
                business_name: "",
                notes: "",
            }
        );
        dispatch("SET_DATA", {
            attr: "portfolio",
            data: {
                trainer_name: "",
                business_name: "",
                notes: "",
            },
        });
    },

    /** Updates the portfolio. */
    async updatePortfolio({ state }) {
        await this._vm.$axios.put(
            `https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`,
            {
                ...state.portfolio,
            }
        );
    },
};
