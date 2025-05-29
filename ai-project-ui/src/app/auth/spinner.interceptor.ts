import { inject } from "@angular/core";
import {
	HttpInterceptorFn,
	HttpRequest,
	HttpHandlerFn,
} from "@angular/common/http";
import { finalize } from "rxjs/operators";
import { SpinnerService } from "../spinner.service";

export const spinnerInterceptorFn: HttpInterceptorFn = (req, next) => {
	const spinner = inject(SpinnerService);
	spinner.show();
	return next(req).pipe(finalize(() => spinner.hide()));
};
