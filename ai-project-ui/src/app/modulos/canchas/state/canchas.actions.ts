import { createAction, props } from "@ngrx/store";
import { Cancha } from "../models/models";

export const initCanchas = createAction("[Canchas] Init Canchas");

export const canchasLoaded = createAction(
	"[Canchas] Canchas Loaded",
	props<{ canchas: Cancha[]; totalCount: number }>()
);

export const crearCancha = createAction(
	"[Canchas] Crear Cancha",
	props<{ tipoSuelo: number }>()
);
