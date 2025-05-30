/// Socio.
export interface UserData {
	userName: string;
	email: string;
	roles: string[];
	socio: {
		id: string;
		numeroSocio: number;
		nombre: string;
		apellido: string;
		telefono: string;
		email: string;
	};
}

/// Login.
export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	refreshToken: string;
	userName: string;
	roles: string[];
	socio: {
		id: string;
		numeroSocio: number;
		nombre: string;
		apellido: string;
		telefono: string;
		email: string;
	};
}

/// Register.
export interface RegisterRequest {
	nombre: string;
	apellido: string;
	telefono: string;
	username: string;
	email: string;
	password: string;
}

export interface OperationResult {
	success: boolean;
	message: string;
}
