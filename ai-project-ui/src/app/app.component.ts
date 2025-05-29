import { Component, OnInit } from "@angular/core";
import { ShellComponent } from "./shell/shell.component";
import type { TopbarButtonClickEvent } from "./shell/shell.component";
import { AuthService } from "./auth/auth.service";
import { TOPBAR_BUTTONS_IDS } from "./topbar/topbar-buttons-ids";
import { NavigationService } from "./navigation.service";
import { SpinnerComponent } from "./spinner/spinner.component";
import { TopbarButton } from "./components/buttons/button.interfaces";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ShellComponent, SpinnerComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
	title = "My Awesome Project";
	mainButton: TopbarButton = {
		id: TOPBAR_BUTTONS_IDS.homeButton,
		label: "Inicio",
		icon: "fa fa-home",
		color: "primary",
		kind: "main",
		disabled: false,
	};
	secondaryButtons: TopbarButton[] = [];

	constructor(
		private readonly authService: AuthService,
		private readonly navigationService: NavigationService
	) {}

	public ngOnInit(): void {
		this.authService.userLoggedIn.subscribe((isLoggedIn) =>
			this.updateSecondaryButtons(isLoggedIn)
		);
	}

	onTopbarButton(event: TopbarButtonClickEvent): void {
		const isLoggedIn = this.authService.userLoggedIn.getValue();
		switch (event.button.id) {
			case TOPBAR_BUTTONS_IDS.loginButton:
				this.navigationService.navigate("/login");
				break;
			case TOPBAR_BUTTONS_IDS.registerButton:
				this.navigationService.navigate("/register");
				break;
			case TOPBAR_BUTTONS_IDS.profileButton:
				if (isLoggedIn) {
					this.navigationService.navigate("/perfil");
				} else {
					this.navigationService.navigate("/login");
				}
				break;
			case TOPBAR_BUTTONS_IDS.logoutButton:
				this.authService.clearSession();
				this.navigationService.navigate("/login");
				break;
			case TOPBAR_BUTTONS_IDS.homeButton:
				this.navigationService.navigate("/");
				break;
			default:
				break;
		}
	}

	private updateSecondaryButtons(isLoggedIn: boolean): void {
		this.secondaryButtons = [];
		isLoggedIn
			? this.secondaryButtons.push(
					{
						id: TOPBAR_BUTTONS_IDS.profileButton,
						label: "Perfil",
						icon: "fa fa-user",
						color: "secondary",
						kind: "secondary",
						disabled: false,
					},
					{
						id: TOPBAR_BUTTONS_IDS.logoutButton,
						label: "Cerrar sesión",
						icon: "fa fa-sign-out",
						color: "secondary",
						kind: "secondary",
						disabled: false,
					}
			  )
			: this.secondaryButtons.push(
					{
						id: TOPBAR_BUTTONS_IDS.loginButton,
						label: "Iniciar sesión",
						icon: "fa fa-sign-in",
						color: "secondary",
						kind: "secondary",
						disabled: false,
					},
					{
						id: TOPBAR_BUTTONS_IDS.registerButton,
						label: "Registrarse",
						icon: "fa fa-user-plus",
						color: "secondary",
						kind: "secondary",
						disabled: false,
					}
			  );
	}
}
