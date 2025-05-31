import { createActionGroup, props } from "@ngrx/store";

export const listActions = createActionGroup({
    source: 'List',
    events: {
        'editButtonClicked': props<{rowId: number | string}>(),
        'deleteButtonClicked': props<{rowId: number | string}>(),
        'pageChanged': props<{
            pageIndex: number;
            pageSize: number;
            listId: string;
        }>(),
    }
})