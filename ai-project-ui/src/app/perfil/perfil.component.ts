import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { filter, Subject, takeUntil } from "rxjs";
import { AdminCanchasComponent } from "./admin-canchas.component";
import { UserData } from "../auth/models";

@Component({
	selector: "app-perfil",
	standalone: true,
	imports: [CommonModule, FormsModule, AdminCanchasComponent],
	templateUrl: "./perfil.component.html",
	styleUrl: "./perfil.component.scss",
})
export class PerfilComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	form: UserData = {
		userName: "",
		email: "",
		roles: [],
		socio: {
			id: "",
			numeroSocio: 0,
			nombre: "",
			apellido: "",
			telefono: "",
			email: "",
		},
	};

	activeSection: "perfil" | "canchas" = "perfil";

	// Estados de edición
	isEditUser = false;
	isEditSocio = false;
	userFormBackup: Partial<UserData> | null = null;
	socioFormBackup: Partial<UserData["socio"]> | null = null;

	constructor(private authService: AuthService) {}

	public ngOnInit() {
		this.authService.userData$
			.pipe(
				takeUntil(this.destroy$),
				filter((x): x is UserData => !!x)
			)
			.subscribe((userData) => {
				this.form = { ...userData };
			});
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	// Edición datos usuario
	onEditUser() {
		this.isEditUser = true;
		this.userFormBackup = {
			userName: this.form.userName,
			email: this.form.socio.email,
		};
	}

	onCancelEditUser() {
		if (this.userFormBackup) {
			this.form.userName = this.userFormBackup.userName || "";
			this.form.socio.email = this.userFormBackup.email || "";
		}
		this.isEditUser = false;
	}

	onSaveUser() {
		// Aquí iría la lógica para guardar los datos editados del usuario
		this.isEditUser = false;
	}

	// Edición datos socio
	onEditSocio() {
		this.isEditSocio = true;
		this.socioFormBackup = { ...this.form.socio };
	}

	onCancelEditSocio() {
		if (this.socioFormBackup) {
			this.form.socio = {
				id: this.socioFormBackup.id ?? "",
				numeroSocio: this.socioFormBackup.numeroSocio ?? 0,
				nombre: this.socioFormBackup.nombre ?? "",
				apellido: this.socioFormBackup.apellido ?? "",
				telefono: this.socioFormBackup.telefono ?? "",
				email: this.socioFormBackup.email ?? "",
			};
		}
		this.isEditSocio = false;
	}

	onSaveSocio() {
		// Aquí iría la lógica para guardar los datos editados del socio
		this.isEditSocio = false;
	}

	onSubmit() {
		// Aquí iría la lógica para actualizar los datos del usuario
		alert("Datos actualizados (simulado): " + JSON.stringify(this.form));
	}
}
