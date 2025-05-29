import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreakpointObserver } from "@angular/cdk/layout";
import { AppButtonComponent } from "../components/buttons/button.component";
import { TopbarButton } from "../components/buttons/button.interfaces";

@Component({
	selector: "app-topbar",
	standalone: true,
	imports: [CommonModule, AppButtonComponent],
	templateUrl: "./topbar.component.html",
	styleUrl: "./topbar.component.scss",
})
export class TopbarComponent implements OnInit {
	@Input() title: string = "";
	@Input() mainButton!: TopbarButton;
	@Input() secondaryButtons: TopbarButton[] = [];

	@Output() buttonClick = new EventEmitter<{
		button: TopbarButton;
		index: number;
		type: "main" | "secondary";
	}>();

	darkTheme = false;
	showMenuButton = false;
	showMenu = false;

	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit() {
		// Leer preferencia de tema guardada
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			this.darkTheme = true;
			document.body.classList.add("dark-theme");
		} else {
			this.darkTheme = false;
			document.body.classList.remove("dark-theme");
		}
		this.breakpointObserver
			.observe(["(max-width: 900px)", "(max-width: 600px)"])
			.subscribe((result) => {
				if (result.matches) {
					this.showMenuButton = true;
				} else {
					this.showMenuButton = false;
				}
			});
	}

	toggleTheme() {
		this.darkTheme = !this.darkTheme;
		if (this.darkTheme) {
			document.body.classList.add("dark-theme");
			localStorage.setItem("theme", "dark");
		} else {
			document.body.classList.remove("dark-theme");
			localStorage.setItem("theme", "light");
		}
	}

	toggleMenu() {
		this.showMenu = !this.showMenu;
	}

	onMainClick() {
		this.buttonClick.emit({ button: this.mainButton, index: 0, type: "main" });
	}

	onSecondaryClick(btn: TopbarButton, idx: number) {
		this.buttonClick.emit({ button: btn, index: idx, type: "secondary" });
	}

	onSecondaryClickMobile(btn: TopbarButton, idx: number) {
		this.onSecondaryClick(btn, idx);
		this.showMenu = false;
	}
}
