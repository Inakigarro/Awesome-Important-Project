import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "../../components/list/list.component";
import { CanchasService } from "./canchas.service";
import { ListColumn } from "../../components/list/models";
import { Cancha } from "./models/models";
import { Subject } from "rxjs";
import { initCanchas } from "./state/canchas.actions";

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

	protected data$ = this.service.canchas$;
	protected totalCount$ = this.service.totalCount$;
	protected totalPages$ = this.service.totalPages$;

	constructor(private readonly service: CanchasService) {}

	public ngOnInit() {
		this.service.dispatch(initCanchas());
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
