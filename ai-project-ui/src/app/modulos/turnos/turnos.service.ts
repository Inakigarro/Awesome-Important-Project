import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cancha } from "./models/cancha.model";
import { Turno } from "./models/turno.model";

@Injectable({ providedIn: "root" })
export class TurnosService {
	constructor(private http: HttpClient) {}

	getCanchas(): Observable<Cancha[]> {
		return this.http.get<Cancha[]>("/api/canchas");
	}

	getTurnosSemana(canchaId: number, semana: string): Observable<Turno[]> {
		// semana: string en formato ISO de lunes de la semana
		return this.http.get<Turno[]>(
			`/api/turnos/disponibles?canchaId=${canchaId}&semana=${semana}`
		);
	}
}
