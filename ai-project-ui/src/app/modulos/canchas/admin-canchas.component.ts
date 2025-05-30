import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "../../components/list/list.component";
import { CanchasService } from "./canchas.service";
import { ListColumn } from "../../components/list/models";
import { Cancha } from "./models/models";
import { Subject, takeUntil } from "rxjs";
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
			property: 'id',
			header: 'Numero de Cancha',
		},
		{
			property: 'tipoSueloId',
			header: 'Tipo de Suelo',
		}
	];

	protected data: Cancha[] = [];
	protected totalCount = 0;

	constructor(private readonly service: CanchasService) {}

	public ngOnInit() {
		this.service.dispatch(initCanchas());
		this.service.canchas$
			.pipe(takeUntil(this.destroy$))
			.subscribe(canchas => this.data = canchas);
		
		this.service.totalCount$
			.pipe(takeUntil(this.destroy$))
			.subscribe(totalCount => this.totalCount = totalCount);
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
