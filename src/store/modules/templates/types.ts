import { GenericResponse } from "@/types";

export type Template = {
    id: number;
    name: string;
    pt_id: string;
    template: string;
} & GenericResponse;
