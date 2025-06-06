import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CanchasService } from "../canchas.service";
import { canchasActions } from "./canchas.actions";
import { map, switchMap, filter, tap } from "rxjs";
import { ObtenerCanchasRequest } from "../models/ObtenerCanchasRequest";
import { TipoSuelo } from "../models/models";
import { listActions } from "../../../components/list/state/list.actions";

@Injectable()
export class CanchasEffects {
	public init$ = createEffect(() =>
		this.actions$.pipe(
			ofType(canchasActions.initCanchas),
			switchMap(() => {
				const request: ObtenerCanchasRequest = {
					pageNumber: 1,
					pageSize: 10,
				};

				return this.canchasService.getCanchas(request);
			}),
			map((response) =>
				canchasActions.canchasLoaded({
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
						canchasActions.canchasLoaded({
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

	public crearCancha$ = createEffect(() =>
		this.actions$.pipe(
			ofType(canchasActions.crearCancha),
			switchMap(({ tipoSuelo }) =>
				this.canchasService.createCancha({ tipoSuelo }).pipe(
					switchMap(() => this.canchasService.getCanchas({ pageNumber: 1, pageSize: 10 }) as any),
					map((response: any) =>
						canchasActions.canchasLoaded({
							canchas: response.items.map((item: any) => ({
								id: item.id,
								tipoSuelo: TipoSuelo[item.tipoSuelo],
							})),
							totalCount: response.totalCount,
						})
					)
				)
			)
		),
	);

	public editarCancha$ = createEffect(() =>
		this.actions$.pipe(
			ofType(canchasActions.editarCancha),
			switchMap(({id, tipoSuelo} ) =>
				this.canchasService.updateCancha({id, tipoSuelo}).pipe(
					switchMap(() => this.canchasService.getCanchas({ pageNumber: 1, pageSize: 10 }) as any),
					map((response: any) =>
						canchasActions.canchasLoaded({
							canchas: response.items.map((item: any) => ({
								id: item.id,
								tipoSuelo: TipoSuelo[item.tipoSuelo],
							})),
							totalCount: response.totalCount,
						})
					)
				))
		)
	);

	constructor(
		private readonly actions$: Actions,
		private readonly canchasService: CanchasService
	) {}
}
