export default {
    /** Finds a client plan. */
    getPlan:
        (state) =>
        ({ clientId, planId }) =>
            state.clients
                .find((c) => c.client_id === parseInt(clientId))
                .plans.find((p) => p.id === parseInt(planId)),

    /** Finds a session. */
    getSession:
        (state) =>
        ({ clientId, planId, sessionId }) =>
            state.clients
                .find((c) => c.client_id === parseInt(clientId))
                .plans.find((p) => p.id === parseInt(planId))
                .sessions.find((s) => s.id === parseInt(sessionId)),
};
