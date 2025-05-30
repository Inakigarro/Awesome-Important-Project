import { Cancha } from "./models";

export interface ObtenerCanchasRequest {
    pageNumber: number;
    pageSize: number;
}

export interface CanchasPagedResult {
    items: Cancha[];
    totalCount: number;
}