import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();
	let authReq = req;
	if (token) {
		authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return next(authReq);
};
