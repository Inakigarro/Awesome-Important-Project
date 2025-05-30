import { createReducer, on } from "@ngrx/store";
import { appInit, appInitSuccess, appInitFailure } from "./app.actions";

export interface AppState {
	initialized: boolean;
	error: string | null;
}

export const initialAppState: AppState = {
	initialized: false,
	error: null,
};

export const appReducer = createReducer(
	initialAppState,
	on(appInit, (state) => ({ ...state, initialized: false, error: null })),
	on(appInitSuccess, (state) => ({ ...state, initialized: true, error: null })),
	on(appInitFailure, (state, { error }) => ({
		...state,
		initialized: false,
		error,
	}))
);
