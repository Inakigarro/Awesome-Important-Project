import { createAction, createActionGroup, props } from "@ngrx/store";
import { UserData } from "../auth.service";

export const setAuthTokens = createAction(
	"[Auth] Set Tokens",
	props<{ token: string; refreshToken: string }>()
);

export const clearAuth = createAction("[Auth] Clear Auth");

export const setUserData = createAction(
	"[Auth] Set User Data",
	props<{ userData: UserData }>()
);

export const loadUserFromToken = createAction("[Auth] Load User From Token");
export const loadUserFromTokenSuccess = createAction(
	"[Auth] Load User From Token Success",
	props<{ userData: UserData }>()
);
export const loadUserFromTokenFailure = createAction(
	"[Auth] Load User From Token Failure"
);

export const LoginActions = createActionGroup({
	source: "Auth",
	events: {
		request: props<{ email: string; password: string }>(),
		success: props<{
			token: string;
			refreshToken: string;
			userData: UserData;
		}>(),
		failure: props<{ error: any }>(),
	},
});
