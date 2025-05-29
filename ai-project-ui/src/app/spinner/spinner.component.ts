import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerService } from "../spinner.service";

@Component({
	selector: "app-spinner",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./spinner.component.html",
	styleUrl: "./spinner.component.scss",
})
export class SpinnerComponent {
	constructor(public spinnerService: SpinnerService) {}
}
