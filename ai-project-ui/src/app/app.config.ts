import {
	ApplicationConfig,
	inject,
	provideAppInitializer,
	provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideStore, provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { routes } from "./app.routes";
import { authInterceptorFn } from "./auth/auth.interceptor";
import { spinnerInterceptorFn } from "./auth/spinner.interceptor";
import { authReducer } from "./auth/state/auth.reducer";
import { AuthEffects } from "./auth/state/auth.effects";
import { appReducer } from "./state/app.reducer";
import { AppEffects } from "./state/app.effects";
import { AuthService } from "./auth/auth.service";
import { canchasReducer } from "./modulos/canchas/state/canchas.reducer";
import { CanchasEffects } from "./modulos/canchas/state/canchas.effects";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([authInterceptorFn, spinnerInterceptorFn])
		),
		provideStore(),
		provideState({ name: "app", reducer: appReducer }),
		provideState({ name: "auth", reducer: authReducer }),
		provideState({ name: "canchas", reducer: canchasReducer }),
		provideEffects([AuthEffects, AppEffects, CanchasEffects]),
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
