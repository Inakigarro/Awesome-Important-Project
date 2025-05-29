import { Component } from "@angular/core";

@Component({
	selector: "app-admin-canchas",
	standalone: true,
	template: `
		<div class="admin-canchas-placeholder">
			<h3>Administración de Canchas</h3>
			<p>Sección en construcción...</p>
		</div>
	`,
	styles: [
		`
			.admin-canchas-placeholder {
				padding: 2rem;
				background: var(--color-bg-alt, #f5f5f5);
				border-radius: 1rem;
				text-align: center;
				margin-top: 2rem;
			}
		`,
	],
})
export class AdminCanchasComponent {}
