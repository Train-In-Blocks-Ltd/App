import { baseAPI } from ".";
import {
    Booking,
    Client,
    Plan,
    Portfolio,
    Session,
    Template,
} from "../store/modules/types";

export type TrainerUserData = {
    sortedClients: Client[];
    sortedArchiveClients: Client[];
    sortedBookings: Booking[];
    templates: Template[];
    portfolio?: Portfolio;
};

export type ClientUserData = {
    name: string;
    number: string;
    profile_image: string;
    pt_id: string;
    portfolio: Portfolio;
    bookings: Booking[];
    plans: Plan[];
};

/** Gets all the data for the trainer-user's session. */
export const getTrainerUserData = async (
    id: string
): Promise<TrainerUserData> => {
    const response = await baseAPI.get<(Client[] | any)[]>(
        `https://api.traininblocks.com/v2/${id}`
    );

    const sortedClients = response.data[0].sort((a: Client, b: Client) => {
        const NAME_A = a.name.toUpperCase();
        const NAME_B = b.name.toUpperCase();
        return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
    });
    const sortedArchiveClients = response.data[1].sort(
        (a: Client, b: Client) => {
            const NAME_A = a.name.toUpperCase();
            const NAME_B = b.name.toUpperCase();
            return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
        }
    );
    const sortedBookings = response.data[4].sort(
        (a: Booking, b: Booking) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    const templates = response.data[2] as Template[];
    const portfolio = response.data[3][0] as Portfolio | undefined;

    return {
        sortedClients,
        sortedArchiveClients,
        sortedBookings,
        templates,
        portfolio,
    };
};

export const getClientUserData = async (
    id: number
): Promise<ClientUserData> => {
    const response = await baseAPI.get(
        `https://api.traininblocks.com/v2/clientUser/${id}`
    );
    const plansResponse = await baseAPI.get(
        `https://api.traininblocks.com/v2/plans/${id}`
    );

    const name = response.data[0][0].name;
    const number = response.data[0][0].number;
    const pt_id = response.data[0][0].pt_id;
    const portfolio = response.data[1][0];
    const profile_image = response.data[2][0].profile_image;
    const bookings = response.data[3].sort(
        (a: Booking, b: Booking) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    const plans: Plan[] = plansResponse.data[0];
    const allSessions: Session[] = plansResponse.data[1];

    return {
        name,
        number,
        pt_id,
        portfolio,
        profile_image,
        bookings,
        plans: plans.map((p) => {
            const sessions = allSessions
                .filter((s) => s.programme_id === p.id)
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );
            return {
                ...p,
                sessions,
            };
        }),
    };
};
