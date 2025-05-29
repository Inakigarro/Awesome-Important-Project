export interface ButtonBase {
	label: string;
	icon?: string;
	type?: "button" | "submit" | "reset";
	color?: "primary" | "accent" | "warn" | "neutral" | string;
	kind?: "main" | "secondary" | "tertiary";
	disabled?: boolean;
	loading?: boolean;
}

export interface ButtonWithId extends ButtonBase {
	id: string;
}

export interface ButtonClickEvent {
	button: ButtonWithId;
	index?: number;
	context?: any;
}

// Para compatibilidad con los botones del topbar
export type TopbarButton = ButtonWithId;
export type TopbarButtonClickEvent = ButtonClickEvent;

export type LoginButton = ButtonWithId;
export type RegisterButton = ButtonWithId;
