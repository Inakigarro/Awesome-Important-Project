import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "../../components/list/list.component";
import { ListColumn } from "../../components/list/models";

// Interfaz de prueba para una cancha
interface CanchaDemo {
	id: number;
	nombre: string;
	tipo: string;
	disponible: boolean;
}

@Component({
	selector: "app-admin-canchas",
	standalone: true,
	imports: [CommonModule, ListComponent],
	templateUrl: "./admin-canchas.component.html",
	styleUrls: ["./admin-canchas.component.scss"],
})
export class AdminCanchasComponent {
	columns: ListColumn<CanchaDemo>[] = [
		{ property: "id", header: "ID" },
		{ property: "nombre", header: "Nombre" },
		{ property: "tipo", header: "Tipo" },
		{ property: "disponible", header: "Disponible" },
	];

	data: CanchaDemo[] = [
		{ id: 1, nombre: "Cancha 1", tipo: "Fútbol 5", disponible: true },
		{ id: 2, nombre: "Cancha 2", tipo: "Fútbol 7", disponible: false },
		{ id: 3, nombre: "Cancha 3", tipo: "Pádel", disponible: true },
	];
}
