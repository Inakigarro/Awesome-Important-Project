import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppButtonComponent } from "../buttons/button.component";
import { ButtonWithId } from "../buttons/button.interfaces";

@Component({
	selector: "app-modal",
	standalone: true,
	imports: [CommonModule, AppButtonComponent],
	templateUrl: "./modal.component.html",
	styleUrl: "./modal.component.scss",
})
export class ModalComponent {
	@Input() open = false;
	@Input() title = "";
	@Input() width: string = "400px";
	@Input() closeOnBackdrop = true;

	@Output() closed = new EventEmitter<void>();

	protected closeButton: ButtonWithId = {
		id: "modal-close-button",
		label: "",
		icon: "fa fa-close",
		kind: "secondary",
		color: "secondary",
		loading: false,
		disabled: false,
	};

	onBackdropClick(event: MouseEvent) {
		if (this.closeOnBackdrop && event.target === event.currentTarget) {
			this.closed.emit();
		}
	}

	close() {
		this.closed.emit();
	}
}
