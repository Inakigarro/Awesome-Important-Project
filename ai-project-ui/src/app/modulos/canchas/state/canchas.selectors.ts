import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CanchasState } from "./canchas.reducer";

export const selectCanchasState =
	createFeatureSelector<CanchasState>("canchas");

export const selectCanchas = createSelector(
	selectCanchasState,
	(state) => state.canchas
);

export const selectTotalCount = createSelector(
	selectCanchasState,
	(state) => state.totalCount
);

export const selectTotalPages = createSelector(
	selectCanchasState,
	(state) => state.totalCount / state.pageSize || 1
);

export const selectCanchasLoading = createSelector(
	selectCanchasState,
	(state) => state.loading
);

export const selectCanchasError = createSelector(
	selectCanchasState,
	(state) => state.error
);

export const selectPageSize = createSelector(
	selectCanchasState,
	(state) => state.pageSize
);

export const selectPageNumber = createSelector(
	selectCanchasState,
	(state) => state.pageNumber
);
