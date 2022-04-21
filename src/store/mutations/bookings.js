export default {
    /** Pushes new booking to 'bookings'. */
    addNewBooking(state, { id, client_id, notes, status, datetime }) {
        state.bookings.push({
            id,
            client_id: parseInt(client_id),
            notes,
            status,
            datetime,
        });
        state.bookings.sort((a, b) => {
            return (
                new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) -
                new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
            );
        });
    },

    /** Updates a booking. */
    updateBooking(state, { id, status }) {
        const BOOKING = state.bookings.find(
            (booking) => booking.id === parseInt(id)
        );
        BOOKING.status = status;
    },

    /** Removes a booking. */
    removeBooking(state, bookingId) {
        const BOOKING = state.bookings.find(
            (booking) => booking.id === parseInt(bookingId)
        );
        state.bookings.splice(state.bookings.indexOf(BOOKING), 1);
    },
};
