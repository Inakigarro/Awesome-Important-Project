import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./app.reducer";

export const selectAppState = createFeatureSelector<AppState>("app");
export const selectAppInitialized = createSelector(
	selectAppState,
	(s) => s.initialized
);
export const selectAppError = createSelector(selectAppState, (s) => s.error);
