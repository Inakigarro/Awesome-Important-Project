import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, firstValueFrom } from "rxjs";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	nombre: string;
	apellido: string;
	telefono: string;
	username: string;
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

@Injectable({ providedIn: "root" })
export class AuthService {
	private readonly authUrl = "https://localhost:7259/api/auth";
	private readonly sociosUrl = "https://localhost:7259/api/socios";
	public userLoggedIn = new BehaviorSubject<boolean>(false);
	public userData = new BehaviorSubject<UserData | null>(null);

	constructor(private http: HttpClient) {}

	login(data: LoginRequest): Observable<AuthResponse> {
		return this.http
			.post<AuthResponse>(`${this.sociosUrl}/iniciar-sesion`, data)
			.pipe(tap((res) => this.saveTokens(res)));
	}

	register(data: RegisterRequest): Observable<AuthResponse> {
		return this.http
			.post<AuthResponse>(`${this.sociosUrl}`, data)
			.pipe(tap((res) => this.saveTokens(res)));
	}

	private saveTokens(res: AuthResponse): void {
		localStorage.setItem("token", res.token);
		localStorage.setItem("refreshToken", res.refreshToken);
	}

	getToken(): string | null {
		return localStorage.getItem("token");
	}

	getRefreshToken(): string | null {
		return localStorage.getItem("refreshToken");
	}

	clearSession(): void {
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		this.userLoggedIn.next(false);
		this.userData.next(null);
	}

	async loadUserFromToken(): Promise<UserData | null> {
		const token = this.getToken();
		if (!token) {
			this.userLoggedIn.next(false);
			this.userData.next(null);
			return null;
		}
		try {
			const user = await firstValueFrom(
				this.http.get<UserData>(`${this.sociosUrl}/me`)
			);
			if (user) {
				this.userLoggedIn.next(true);
				this.userData.next(user);
				return user;
			} else {
				this.clearSession();
				return null;
			}
		} catch {
			this.clearSession();
			return null;
		}
	}
}
