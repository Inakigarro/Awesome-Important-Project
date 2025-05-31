export interface CanchaDto {
	id: number;
	tipoSuelo: number;
}

export interface Cancha {
	id: number;
	tipoSuelo: string;
}

export enum TipoSuelo {
	"Polvo de Ladrillo" = 1,
	"Hormigon" = 2,
	"Cesped" = 3,
}
