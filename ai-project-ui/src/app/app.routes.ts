import { Router, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { inject } from "@angular/core";
import { AuthService } from "./auth/auth.service";

export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{
		path: "perfil",
		component: PerfilComponent,
		canActivate: [
			() => {
				const authService = inject(AuthService);
				const router = inject(Router);
				if (!authService.userLoggedIn.getValue()) {
					router.navigate(["/login"]);
					return false;
				}
				return true;
			},
		],
	},
];
