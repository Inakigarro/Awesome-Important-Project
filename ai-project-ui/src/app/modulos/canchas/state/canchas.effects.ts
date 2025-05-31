import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CanchasService } from "../canchas.service";
import { canchasLoaded, initCanchas } from "./canchas.actions";
import { map, switchMap, filter } from "rxjs";
import { ObtenerCanchasRequest } from "../models/ObtenerCanchasRequest";
import { TipoSuelo } from "../models/models";
import { listActions } from "../../../components/list/state/list.actions";

@Injectable()
export class CanchasEffects {
	public init$ = createEffect(() =>
		this.actions$.pipe(
			ofType(initCanchas),
			switchMap(() => {
				const request: ObtenerCanchasRequest = {
					pageNumber: 1,
					pageSize: 10,
				};

				return this.canchasService.getCanchas(request);
			}),
			map((response) =>
				canchasLoaded({
					canchas: response.items.map((item) => {
						return {
							id: item.id,
							tipoSuelo: TipoSuelo[item.tipoSuelo],
						};
					}),
					totalCount: response.totalCount,
				})
			)
		)
	);

	public pageChanged$ = createEffect(() =>
		this.actions$.pipe(
			ofType(listActions.pageChanged),
			// Solo reaccionar si es la lista de canchas
			filter((action) => action.listId === "canchas-list"),
			switchMap(({ pageIndex, pageSize }) => {
				const request: ObtenerCanchasRequest = {
					pageNumber: pageIndex + 1,
					pageSize,
				};
				return this.canchasService.getCanchas(request).pipe(
					map((response) =>
						canchasLoaded({
							canchas: response.items.map((item) => ({
								id: item.id,
								tipoSuelo: TipoSuelo[item.tipoSuelo],
							})),
							totalCount: response.totalCount,
						})
					)
				);
			})
		)
	);

	constructor(
		private readonly actions$: Actions,
		private readonly canchasService: CanchasService
	) {}
}
