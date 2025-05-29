import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TopbarComponent } from "../topbar/topbar.component";
import { TopbarButton } from "../components/buttons/button.interfaces";

export type TopbarButtonClickEvent = {
	button: TopbarButton;
	index: number;
	type: "main" | "secondary";
};

@Component({
	selector: "app-shell",
	standalone: true,
	imports: [RouterOutlet, TopbarComponent],
	templateUrl: "./shell.component.html",
	styleUrl: "./shell.component.scss",
})
export class ShellComponent {
	@Input() title: string = "";
	@Input() mainButton!: TopbarButton;
	@Input() secondaryButtons: TopbarButton[] = [];

	@Output() topbarButtonClick = new EventEmitter<TopbarButtonClickEvent>();

	onTopbarButton(event: TopbarButtonClickEvent): void {
		this.topbarButtonClick.emit(event);
	}
}
