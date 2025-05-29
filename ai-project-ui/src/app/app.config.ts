import {
	ApplicationConfig,
	provideZoneChangeDetection,
	provideAppInitializer,
	inject,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideStore, provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { routes } from "./app.routes";
import { AuthService } from "./auth/auth.service";
import { authInterceptorFn } from "./auth/auth.interceptor";
import { spinnerInterceptorFn } from "./auth/spinner.interceptor";
import { authReducer } from "./auth/state/auth.reducer";
import { AuthEffects } from "./auth/state/auth.effects";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([authInterceptorFn, spinnerInterceptorFn])
		),
		provideStore(),
		provideState({ name: "auth", reducer: authReducer }),
		provideEffects([AuthEffects]),
		provideStoreDevtools({
			maxAge: 25,
			autoPause: true,
			logOnly: false,
		}),
		provideAppInitializer(() => {
			const authService = inject(AuthService);
			return authService.loadUserFromToken();
		}),
	],
};
