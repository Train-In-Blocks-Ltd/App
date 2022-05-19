import { baseAPI } from ".";
import { Booking, Client, Portfolio, Template } from "../store/modules/types";

type HighLevelData = {
    sortedClients: Client[];
    sortedArchiveClients: Client[];
    sortedBookings: Booking[];
    templates: Template[];
    portfolio?: Portfolio;
};

/** Gets all the data for the trainer-user's session. */
export const useGetHighLevelData = async (
    id: string
): Promise<HighLevelData> => {
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
