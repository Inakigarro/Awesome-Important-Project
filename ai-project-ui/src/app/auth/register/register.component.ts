import { Component, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subject, takeUntil } from "rxjs";
import { NavigationService } from "../../navigation.service";
import { AppButtonComponent } from "../../components/buttons/button.component";
import { RegisterButton } from "../../components/buttons/button.interfaces";
import { RegisterRequest } from "../models";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AppButtonComponent],
})
export class RegisterComponent implements OnDestroy {
	private destroy$ = new Subject<void>();
	// Datos de usuario
	username = "";
	email = "";
	password = "";

	// Datos del socio
	nombre = "";
	apellido = "";
	telefono = "";

	showSuccess = false;
	showError = false;
	errorMsg = "";

	registerButton: RegisterButton = {
		id: "register-button",
		label: "Registrarse",
		color: "primary",
		kind: "main",
		disabled: false,
	};

	constructor(
		private readonly authService: AuthService,
		private readonly navService: NavigationService
	) {}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmit() {
		const registerRequest: RegisterRequest = {
			nombre: this.nombre,
			apellido: this.apellido,
			telefono: this.telefono,
			username: this.username,
			email: this.email,
			password: this.password,
		};

		this.authService
			.register(registerRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.showError = false;
					this.showSuccess = true;
					setTimeout(() => {
						this.showSuccess = false;
						this.navService.navigate("/login");
					}, 1500);
				},
				error: (error) => {
					this.showSuccess = false;
					this.showError = true;
					this.errorMsg =
						error?.error?.message || error.message || "Error desconocido";
					setTimeout(() => {
						this.showError = false;
					}, 2500);
				},
			});
	}
}
