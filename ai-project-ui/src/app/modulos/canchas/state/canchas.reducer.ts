import { Cancha } from "../models/models";
import { createReducer, on } from "@ngrx/store";

export interface CanchasState {
    canchas: Cancha[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

export const initialCanchasState: CanchasState = {
    canchas: [],
    totalCount: 0,
    loading: false,
    error: null,
};

export const canchasReducer = createReducer(
    initialCanchasState,
);