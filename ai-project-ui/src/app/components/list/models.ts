export interface ListColumn<T> {
	property: keyof T;
	header: string;
}

export type ListRow<T> = T;
