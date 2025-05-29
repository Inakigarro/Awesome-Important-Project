import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../auth.service";
import { LoginActions } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { NavigationService } from "../../navigation.service";

@Injectable()
export class AuthEffects {
	public login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(LoginActions.request),
			switchMap(({ email, password }) =>
				this.authService.login({ email, password }).pipe(
					map((response) => {
						return LoginActions.success({
							token: response.token,
							refreshToken: response.refreshToken,
							userData: {
								userName: response.userName,
								email: response.socio.email,
								roles: response.roles,
								socio: { ...response.socio },
							},
						});
					}),
					catchError((error) => of(LoginActions.failure({ error })))
				)
			)
		)
	);

	public loginSuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(LoginActions.success),
				tap(() => {
					this.navigationService.navigate("/");
				})
			),
		{ dispatch: false }
	);

	constructor(
		private actions$: Actions,
		private authService: AuthService,
		private navigationService: NavigationService
	) {}
}
