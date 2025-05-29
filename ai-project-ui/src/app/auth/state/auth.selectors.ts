import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectAuthToken = createSelector(
	selectAuthState,
	(state) => state.token
);

export const selectRefreshToken = createSelector(
	selectAuthState,
	(state) => state.refreshToken
);

export const selectUserData = createSelector(
	selectAuthState,
	(state) => state.userData
);

export const selectAuthLoading = createSelector(
	selectAuthState,
	(state) => state.loading
);
