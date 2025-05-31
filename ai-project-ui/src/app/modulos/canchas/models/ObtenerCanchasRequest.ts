import { CanchaDto } from "./models";

export interface ObtenerCanchasRequest {
	pageNumber: number;
	pageSize: number;
}

export interface CanchasPagedResult {
	items: CanchaDto[];
	totalCount: number;
}
