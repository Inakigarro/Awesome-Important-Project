import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CanchasService } from "../canchas.service";
import { canchasLoaded, initCanchas } from "./canchas.actions";
import { map, switchMap } from "rxjs";
import { ObtenerCanchasRequest } from "../models/ObtenerCanchasRequest";
import { TipoSuelo } from "../models/models";

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
	constructor(
		private readonly actions$: Actions,
		private readonly canchasService: CanchasService
	) {}
}
