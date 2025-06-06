import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TurnosService } from "./turnos.service";
import { Cancha } from "./models/cancha.model";
import { Turno } from "./models/turno.model";
import { FormsModule } from "@angular/forms";
import { AppButtonComponent } from "../../components/buttons/button.component";
import { ButtonWithId } from "../../components/buttons/button.interfaces";

@Component({
	selector: "app-turnos",
	standalone: true,
	imports: [CommonModule, FormsModule, AppButtonComponent],
	templateUrl: "./turnos.component.html",
	styleUrls: ["./turnos.component.scss"],
})
export class TurnosComponent implements OnInit {
	canchas: Cancha[] = [];
	turnos: Turno[] = [];
	selectedCanchaId: number;
	semanaActual: Date = this.getMonday(new Date());
	diasSemana: Date[] = [];
	carruselDiaIndex: number = 0;
	horas: string[] = [
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
		"22:00",
	];

	protected carruselButtons: ButtonWithId[] = this.horas.map((hora) => ({
		id: `reservar-${hora}`,
		label: `Reservar ${hora}`,
		icon: "",
		kind: "main",
	}));

	protected backButton: ButtonWithId = {
		id: "carrusel-back",
		label: "",
		icon: "fa fa-arrow-left",
		kind: "secondary",
	};

	protected forwardButton: ButtonWithId = {
		id: "carrusel-forward",
		label: "",
		icon: "fa fa-arrow-right",
		kind: "secondary",
	};

	constructor(private turnosService: TurnosService) {}

	ngOnInit() {
		this.turnosService.getCanchas().subscribe((canchas) => {
			this.canchas = canchas;
			if (canchas.length) this.selectedCanchaId = canchas[0].id;
			this.loadTurnos();
		});
		this.setDiasSemana();
	}

	setDiasSemana() {
		this.diasSemana = Array.from({ length: 7 }, (_, i) => {
			const d = new Date(this.semanaActual);
			d.setDate(d.getDate() + i);
			return d;
		});
	}

	loadTurnos() {
		if (!this.selectedCanchaId) return;
		const semanaIso = this.semanaActual.toISOString().split("T")[0];
		this.turnosService
			.getTurnosSemana(this.selectedCanchaId, semanaIso)
			.subscribe((turnos) => (this.turnos = turnos));
	}

	onCanchaChange(canchaId: number) {
		this.selectedCanchaId = canchaId;
		this.loadTurnos();
	}

	onSemanaChange(delta: number) {
		this.semanaActual.setDate(this.semanaActual.getDate() + delta * 7);
		this.setDiasSemana();
		this.loadTurnos();
	}

	getTurno(dia: Date, hora: string): Turno | undefined {
		const fecha = dia.toISOString().split("T")[0];
		return this.turnos.find((t) => t.fecha === fecha && t.horaInicio === hora);
	}

	getMonday(d: Date): Date {
		const date = new Date(d);
		const day = date.getDay();
		const diff = date.getDate() - day + (day === 0 ? -6 : 1);
		date.setDate(diff);
		date.setHours(0, 0, 0, 0);
		return date;
	}
}
