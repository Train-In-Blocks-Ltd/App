import { GenericResponse } from ".";

export type BookingStatus = "Past" | "Pending" | "Scheduled" | "Cancelled";
export type Booking = {
    id: number;
    client_id: number;
    datetime: string;
    notes: string;
    status: BookingStatus;
} & GenericResponse;
