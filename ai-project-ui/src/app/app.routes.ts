import { Router, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { inject } from "@angular/core";
import { AuthService } from "./auth/auth.service";

export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "perfil", component: PerfilComponent },
];
