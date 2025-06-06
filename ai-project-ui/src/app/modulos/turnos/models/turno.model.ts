import { PersonaTurno } from "./persona-turno.model";

export interface Turno {
	id: string;
	canchaId: number;
	fecha: string; // ISO date
	horaInicio: string; // HH:mm
	horaFin: string; // HH:mm
	socioSolicitanteId: string;
	personas: PersonaTurno[];
}
