import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { UserData } from "../models";

export interface AuthState {
	token: string | null;
	refreshToken: string | null;
	userData: UserData | null;
	loading: boolean;
}

export const initialAuthState: AuthState = {
	token: null,
	refreshToken: null,
	userData: null,
	loading: false,
};

export const authReducer = createReducer(
	initialAuthState,
	on(AuthActions.LoginActions.success, (state, action) => ({
		...state,
		token: action.token,
		refreshToken: action.refreshToken,
		userData: action.userData,
		loading: false,
	})),
	on(AuthActions.setAuthTokens, (state, { token, refreshToken }) => ({
		...state,
		token,
		refreshToken,
	})),
	on(AuthActions.clearAuth, () => initialAuthState),
	on(AuthActions.setUserData, (state, { userData }) => ({
		...state,
		userData,
	})),
	on(AuthActions.loadUserFromToken, (state) => ({ ...state, loading: true })),
	on(AuthActions.loadUserFromTokenSuccess, (state, { userData }) => ({
		...state,
		userData,
		loading: false,
	})),
	on(AuthActions.loadUserFromTokenFailure, (state) => ({
		...state,
		userData: null,
		loading: false,
	}))
);
