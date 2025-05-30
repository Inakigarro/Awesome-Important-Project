import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable, tap } from "rxjs";
import {
	AuthResponse,
	LoginRequest,
	OperationResult,
	RegisterRequest,
	UserData,
} from "./models";
import { Action, Store } from "@ngrx/store";
import {
	selectAuthToken,
	selectRefreshToken,
	selectUserData,
	selectUserLoggedIn,
} from "./state/auth.selectors";
import { clearAuth, setAuthTokens, setUserData } from "./state/auth.actions";
import {
	loadUserFromToken,
	loadUserFromTokenFailure,
} from "./state/auth.actions";

@Injectable({ providedIn: "root" })
export class AuthService {
	private readonly sociosUrl = "https://localhost:7259/api/socios";

	public isUserLoggedIn$ = this.store.select(selectUserLoggedIn);
	public userData$ = this.store.select(selectUserData);
	public token$ = this.store.select(selectAuthToken);
	public refreshToken$ = this.store.select(selectRefreshToken);

	constructor(private http: HttpClient, private store: Store) {}

	login(data: LoginRequest): Observable<AuthResponse> {
		return this.http
			.post<AuthResponse>(`${this.sociosUrl}/iniciar-sesion`, data)
			.pipe(tap((res) => this.saveTokens(res)));
	}

	register(data: RegisterRequest): Observable<OperationResult> {
		return this.http.post<OperationResult>(`${this.sociosUrl}`, data);
	}

	private saveTokens(res: AuthResponse) {
		this.dispatch(
			setAuthTokens({
				token: res.token,
				refreshToken: res.refreshToken,
			})
		);

		localStorage.setItem("token", res.token);
		localStorage.setItem("refreshToken", res.refreshToken);
	}

	clearSession() {
		this.dispatch(clearAuth());
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
	}

	async loadUserFromToken(): Promise<UserData | null> {
		const token = localStorage.getItem("token");
		const refreshToken = localStorage.getItem("refreshToken");
		if (!token || !refreshToken) {
			this.store.dispatch(loadUserFromTokenFailure());
			return null;
		}

		this.dispatch(setAuthTokens({ token, refreshToken }));

		try {
			const userData = await firstValueFrom(
				this.http.get<UserData>(`${this.sociosUrl}/me`)
			);

			if (userData) {
				this.dispatch(setUserData({ userData }));
				return userData;
			} else {
				this.clearSession();
				return null;
			}
		} catch (error) {
			this.clearSession();
			return null;
		}
	}

	getToken(): string | null {
		return localStorage.getItem("token");
	}

	public dispatch(action: Action) {
		this.store.dispatch(action);
	}
}
