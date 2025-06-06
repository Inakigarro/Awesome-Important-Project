import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { Cancha } from "../models/models";

export const canchasActions = createActionGroup({
	source: "Canchas",
	events: {
		"Init Canchas": emptyProps(),
		"Canchas Loaded": props<{ canchas: Cancha[]; totalCount: number }>(),
		"Crear Cancha": props<{ tipoSuelo: number }>(),
		"Editar Cancha": props<{ id: number; tipoSuelo: number }>(),
	},
})

export const initCanchas = createAction("[Canchas] Init Canchas");

export const canchasLoaded = createAction(
	"[Canchas] Canchas Loaded",
	props<{ canchas: Cancha[]; totalCount: number }>()
);

export const crearCancha = createAction(
	"[Canchas] Crear Cancha",
	props<{ tipoSuelo: number }>()
);
