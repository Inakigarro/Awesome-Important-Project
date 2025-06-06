import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "../../components/list/list.component";
import { CanchasService } from "./canchas.service";
import { ListColumn } from "../../components/list/models";
import { Cancha, CanchaDto, TipoSuelo } from "./models/models";
import { Subject } from "rxjs";
import { canchasActions, crearCancha, initCanchas } from "./state/canchas.actions";
import { selectPageSize, selectPageNumber } from "./state/canchas.selectors";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { FormsModule } from "@angular/forms";
import { CrearCanchaModalComponent } from "./components/crear-cancha/crear-cancha-modal.component";
import { ButtonWithId } from "../../components/buttons/button.interfaces";
import { AppButtonComponent } from "../../components/buttons/button.component";
import { EditarCanchaModalComponent } from "./components/editar-cancha/editar-cancha-modal.component";

@Component({
	selector: "app-admin-canchas",
	standalone: true,
	imports: [
    CommonModule,
    ListComponent,
    FormsModule,
    CrearCanchaModalComponent,
    AppButtonComponent,
    EditarCanchaModalComponent
],
	templateUrl: "./admin-canchas.component.html",
	styleUrls: ["./admin-canchas.component.scss"],
})
export class AdminCanchasComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	protected columns: ListColumn<Cancha>[] = [
		{
			property: "id",
			header: "Numero de Cancha",
			classes: ["list-col-xs", "list-align-center"],
		},
		{
			property: "tipoSuelo",
			header: "Tipo de Suelo",
			classes: [],
		},
	];
	protected newButton: ButtonWithId = {
		id: "new-cancha-button",
		label: "Nueva Cancha",
		icon: "fa fa-plus",
		color: "primary",
		kind: "main",
		disabled: false,
	};

	protected listId = "canchas-list";
	protected data$ = this.service.canchas$;
	protected totalCount$ = this.service.totalCount$;
	protected totalPages$ = this.service.totalPages$;
	protected canchaSeleccionada: CanchaDto | null = null;
	public pageSize$ = this.store.select(selectPageSize);
	public pageIndex$ = this.store
		.select(selectPageNumber)
		.pipe(map((n) => n - 1));

	showCreateModal = false;
	showEditModal = false;
	createForm = { tipoSuelo: null as number | null };
	tipoSuelos = [
		{ value: 1, label: "Polvo de Ladrillo" },
		{ value: 2, label: "Hormigón" },
		{ value: 3, label: "Césped" },
	];

	constructor(
		private readonly service: CanchasService,
		private readonly store: Store
	) {}

	public ngOnInit() {
		this.service.dispatch(initCanchas());
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	openCreateModal() {
		this.showCreateModal = true;
	}

	closeCreateModal() {
		this.showCreateModal = false;
	}

	onCancelCreateCancha() {
		this.createForm = { tipoSuelo: null };
		this.closeCreateModal();
	}

	public onSubmitCreateCancha(event: { tipoSuelo: number }) {
		if (event && event.tipoSuelo) {
			this.store.dispatch(canchasActions.crearCancha({tipoSuelo: event.tipoSuelo}));
			this.createForm = { tipoSuelo: null };
			this.closeCreateModal();
		}
	}

	protected onEdit(cancha: Cancha) {
		this.canchaSeleccionada = {
			id: cancha.id,
			tipoSuelo: TipoSuelo[cancha.tipoSuelo as keyof typeof TipoSuelo],
		}

		this.showEditModal = true;
	}

	protected onCloseEditModal() {
		this.showEditModal = false;
		this.canchaSeleccionada = null;
	}

	protected onSubmitEditCancha(event: CanchaDto) {
		if (event && event.id && event.tipoSuelo) {
			this.service.dispatch(canchasActions.editarCancha({
				id: event.id,
				tipoSuelo: event.tipoSuelo
			}));
			this.showEditModal = false;
			this.canchaSeleccionada = null;
		}
	}
}
