import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { authGuard } from "./auth/auth.guard";
import { TurnosComponent } from "./modulos/turnos/turnos.component";

export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "perfil", component: PerfilComponent, canActivate: [authGuard] },
	{ path: "", component: TurnosComponent },
];
