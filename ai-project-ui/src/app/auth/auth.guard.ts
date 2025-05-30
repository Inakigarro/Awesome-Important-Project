import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectUserLoggedIn } from "./state/auth.selectors";
import { map, take } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
	const store = inject(Store);
	return store.select(selectUserLoggedIn).pipe(
		take(1),
		map((isLoggedIn) => {
			if (!isLoggedIn) {
				window.location.href = "/login";
				return false;
			}
			return true;
		})
	);
};
