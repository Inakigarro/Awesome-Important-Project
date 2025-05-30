import { createAction, props } from "@ngrx/store";

export const appInit = createAction("[App] Init");
export const appInitSuccess = createAction("[App] Init Success");
export const appInitFailure = createAction(
	"[App] Init Failure",
	props<{ error: string }>()
);
