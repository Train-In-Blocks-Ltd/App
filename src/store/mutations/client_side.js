export default {
    /** Pushes a new booking to 'clientUser.bookings'. */
    addNewBookingClientSide(state, { id, client_id, datetime, notes, status }) {
        state.clientUser.bookings.push({
            id: parseInt(id),
            client_id: parseInt(client_id),
            datetime,
            notes,
            status,
        });
        state.clientUser.bookings.sort((a, b) => {
            return (
                new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) -
                new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
            );
        });
    },

    /** Removes a booking from 'clientUser.bookings'. */
    removeBookingClientSide(state, { bookingId }) {
        const BOOKING = state.clientUser.bookings.find(
            (booking) => booking.id === parseInt(bookingId)
        );
        state.clientUser.bookings.splice(
            state.clientUser.bookings.indexOf(BOOKING),
            1
        );
    },

    /** Updates the sessions of the plan. */
    setClientUserPlan(state, { planId, sessions }) {
        const PLAN = state.clientUser.plans.find(
            (plan) => plan.id === parseInt(planId)
        );
        PLAN.sessions = sessions;
    },

    /** Loads the client-user profile image. */
    updateClientUserProfileImage(state, profileImage) {
        state.clientUser.profile_image = profileImage;
    },

    /** Updates an attribute for a single session from the client-user. */
    updateClientUserPlanSingleSession(
        state,
        { planId, sessionId, attr, data }
    ) {
        const PLAN = state.clientUser.plans.find(
            (plan) => plan.id === parseInt(planId)
        );
        const SESSION = PLAN.sessions.find(
            (session) => session.id === parseInt(sessionId)
        );
        SESSION[attr] = data;
    },
};
