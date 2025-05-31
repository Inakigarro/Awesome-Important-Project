import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, Store } from "@ngrx/store";
import {
	CanchasPagedResult,
	ObtenerCanchasRequest,
} from "./models/ObtenerCanchasRequest";
import {
	selectCanchas,
	selectTotalCount,
	selectTotalPages,
} from "./state/canchas.selectors";

@Injectable({
	providedIn: "root",
})
export class CanchasService {
	private readonly canchasUrl = "https://localhost:7259/api/canchas";

	public canchas$ = this.store.select(selectCanchas);
	public totalCount$ = this.store.select(selectTotalCount);
	public totalPages$ = this.store.select(selectTotalPages);

	constructor(private http: HttpClient, private store: Store) {}

	public getCanchas(request: ObtenerCanchasRequest) {
		let params = new HttpParams();
		params = params.set("pageNumber", request.pageNumber);
		params = params.set("pageSize", request.pageSize);

		return this.http.get<CanchasPagedResult>(`${this.canchasUrl}`, { params });
	}

	public createCancha(request: { tipoSuelo: number }) {
		return this.http.post<any>(`${this.canchasUrl}`, request);
	}

	public dispatch(action: Action) {
		this.store.dispatch(action);
	}
}
