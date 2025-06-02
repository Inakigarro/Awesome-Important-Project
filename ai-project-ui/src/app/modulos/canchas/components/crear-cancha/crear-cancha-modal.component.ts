import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { AppButtonComponent } from "../../../../components/buttons/button.component";
import { ModalComponent } from "../../../../components/modal/modal.component";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "app-crear-cancha-modal",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AppButtonComponent,
		ModalComponent,
	],
	templateUrl: "./crear-cancha-modal.component.html",
	styleUrls: ["./crear-cancha-modal.component.scss"],
})
export class CrearCanchaModalComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	@Input() show = false;
	@Input() tipoSuelos: { value: number; label: string }[] = [];
	@Output() close = new EventEmitter<void>();
	@Output() save = new EventEmitter<{ tipoSuelo: number }>();

	protected form: FormGroup;
	protected disabled = false;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			tipoSuelo: this.formBuilder.control(null, [Validators.required]),
		});

		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.disabled = !this.form.valid;
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSave() {
		if (this.form.valid) {
			this.save.emit({ tipoSuelo: this.form.value.tipoSuelo });
		}
	}
}
