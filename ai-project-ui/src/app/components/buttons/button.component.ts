import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	ButtonWithId,
	TopbarButton,
	TopbarButtonClickEvent,
} from "../buttons/button.interfaces";

@Component({
	selector: "app-button",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./button.component.html",
	styleUrls: ["./button.component.scss"],
})
export class AppButtonComponent implements OnInit {
	@Input() button!: ButtonWithId;
	@Input() index?: number;
	@Input() classes: string[] = [];
	@Input() disabled?: boolean;
	@Output() buttonClick = new EventEmitter<TopbarButtonClickEvent>();

	hasIcon: boolean = false;
	hasLoading: boolean = false;
	colorTheme: string = "";
	kind: string = "";

	public ngOnInit(): void {
		this.hasIcon = !!this.button.icon;
		this.hasLoading = !!this.button.loading;
		this.colorTheme = this.button.color ?? "primary";
		this.kind = this.button.kind ? `btn-${this.button.kind}` : "btn-main";
		this.disabled = this.disabled
			? this.disabled
			: this.button.disabled ?? false;
	}

	onClick() {
		if (!this.button.disabled && !this.button.loading) {
			this.buttonClick.emit({ button: this.button, index: this.index });
		}
	}
}
