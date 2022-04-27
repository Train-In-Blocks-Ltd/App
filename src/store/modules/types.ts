import { GenericResponse } from "@/types";

export type Template = {
    id: number;
    name: string;
    pt_id: string;
    template: string;
} & GenericResponse;

export type Client = {
    client_id: number;
    pt_id: string;
    archive: number;
    name: string;
    email: string;
    number: string;
    profile_image?: string;
    notifications: number;
    notes: string;
} & GenericResponse;
