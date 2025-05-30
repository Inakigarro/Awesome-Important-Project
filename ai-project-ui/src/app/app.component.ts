import { Component, OnDestroy, OnInit } from "@angular/core";
import { ShellComponent } from "./shell/shell.component";
import type { TopbarButtonClickEvent } from "./shell/shell.component";
import { AuthService } from "./auth/auth.service";
import { TOPBAR_BUTTONS_IDS } from "./topbar/topbar-buttons-ids";
import { NavigationService } from "./navigation.service";
import { SpinnerComponent } from "./spinner/spinner.component";
import { TopbarButton } from "./components/buttons/button.interfaces";
import { Subject, takeUntil } from "rxjs";
import { Store } from "@ngrx/store";
import { appInit } from "./state/app.actions";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ShellComponent, SpinnerComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, OnDestroy {
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
	private destroy$ = new Subject<void>();
	private isUserLoggedIn = false;

	constructor(
		private readonly authService: AuthService,
		private readonly navigationService: NavigationService,
		private readonly store: Store
	) {}

	public ngOnInit(): void {
		this.store.dispatch(appInit());
		this.authService.isUserLoggedIn$
			.pipe(takeUntil(this.destroy$))
			.subscribe((isLoggedIn) => {
				this.isUserLoggedIn = isLoggedIn;
				this.updateSecondaryButtons();
			});
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onTopbarButton(event: TopbarButtonClickEvent): void {
		switch (event.button.id) {
			case TOPBAR_BUTTONS_IDS.loginButton:
				this.navigationService.navigate("/login");
				break;
			case TOPBAR_BUTTONS_IDS.registerButton:
				this.navigationService.navigate("/register");
				break;
			case TOPBAR_BUTTONS_IDS.profileButton:
				if (this.isUserLoggedIn) {
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

	private updateSecondaryButtons() {
		this.secondaryButtons = [];
		this.isUserLoggedIn
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
