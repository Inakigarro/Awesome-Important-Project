import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "../../components/list/list.component";
import { CanchasService } from "./canchas.service";
import { ListColumn } from "../../components/list/models";
import { Cancha } from "./models/models";
import { Subject } from "rxjs";
import { initCanchas } from "./state/canchas.actions";
import { selectPageSize, selectPageNumber } from "./state/canchas.selectors";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

@Component({
	selector: "app-admin-canchas",
	standalone: true,
	imports: [CommonModule, ListComponent],
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

	protected listId = "canchas-list";
	protected data$ = this.service.canchas$;
	protected totalCount$ = this.service.totalCount$;
	protected totalPages$ = this.service.totalPages$;
	public pageSize$ = this.store.select(selectPageSize);
	public pageIndex$ = this.store.select(selectPageNumber).pipe(map((n) => n - 1));

	constructor(private readonly service: CanchasService, private readonly store: Store) {}

	public ngOnInit() {
		this.service.dispatch(initCanchas());
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
