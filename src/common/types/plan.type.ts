import { GenericResponse } from ".";

export type EventRow = {
    name: string;
    date: string;
    color: string;
    textColor: string;
    week_id: number;
    id: number;
};

export type Protocol = {
    name: string;
    date: string;
    exercise: string;
    protocol: string;
};

export type VisualiseData = {
    x: string;
    y?: number;
};

export type Session = {
    id: number;
    programme_id: number;
    week_id: number;
    name: string;
    date: string;
    notes: string;
    feedback: string | null;
    checked: number;
} & GenericResponse;

export type Plan = {
    id: number;
    client_id: number;
    name: string;
    duration: number;
    block_color: string;
    notes: string;
    sessions?: Session[];
} & GenericResponse;
