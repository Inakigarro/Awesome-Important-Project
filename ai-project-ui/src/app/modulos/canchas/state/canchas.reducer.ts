import { Cancha } from "../models/models";
import { createReducer, on } from "@ngrx/store";
import { canchasActions } from "./canchas.actions";

export interface CanchasState {
	canchas: Cancha[];
	pageNumber: number;
	pageSize: number;
	totalCount: number;
	loading: boolean;
	error: string | null;
}

export const initialCanchasState: CanchasState = {
	canchas: [],
	pageNumber: 1,
	pageSize: 10,
	totalCount: 0,
	loading: false,
	error: null,
};

export const canchasReducer = createReducer(
	initialCanchasState,
	on(canchasActions.canchasLoaded, (state, action) => ({
		...state,
		canchas: action.canchas,
		totalCount: action.totalCount,
	}))
);
