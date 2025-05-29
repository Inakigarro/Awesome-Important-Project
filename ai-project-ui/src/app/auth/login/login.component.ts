import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NavigationService } from "../../navigation.service";
import { Store } from "@ngrx/store";
import { LoginActions } from "../state/auth.actions";
import { AppButtonComponent } from "../../components/buttons/button.component";
import {
	ButtonBase,
	LoginButton,
} from "../../components/buttons/button.interfaces";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [CommonModule, RouterLink, FormsModule, AppButtonComponent],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	email = "";
	password = "";
	submitButton: LoginButton = {
		id: "login-button",
		label: "Iniciar sesión",
		color: "primary",
		kind: "main",
		disabled: false,
	};

	constructor(private store: Store, private navService: NavigationService) {}

	onSubmit() {
		this.store.dispatch(
			LoginActions.request({
				email: this.email,
				password: this.password,
			})
		);
	}
}
