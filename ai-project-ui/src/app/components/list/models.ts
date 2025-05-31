export interface ListColumn<T> {
	property: keyof T;
	header: string;
	classes: string[];
}

export type ListRow<T> = T;
