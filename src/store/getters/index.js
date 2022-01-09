export default {
    /**
     * Helps gets plans or sessions.
     * @returns Specified data.
     */
    helper: (state, getters) => (type, clientId, planId, sessionId) => {
        const CLIENT = state.clients.find(
            (client) => client.client_id === parseInt(clientId)
        );
        switch (type) {
            case "match_plan":
                return CLIENT.plans.find(
                    (plan) => plan.id === parseInt(planId)
                );
            case "match_session": {
                const PLAN = getters.helper("match_plan", clientId, planId);
                return PLAN.sessions.find(
                    (session) => session.id === parseInt(sessionId)
                );
            }
        }
    },
};
