import {
	Component,
	Input,
	Output,
	EventEmitter,
	HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListColumn, ListRow } from "./models";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { listActions } from "./state/list.actions";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-list",
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: "./list.component.html",
	styleUrl: "./list.component.scss",
})
export class ListComponent<TItem> {
	@Input()
	public columns: ListColumn<TItem>[] = [];

	@Input()
	public data: Observable<TItem[]>;

	@Input()
	public totalItems: Observable<number>;

	@Input()
	public totalPages: Observable<number>;

	@Output() edit = new EventEmitter<TItem>();
	@Output() delete = new EventEmitter<TItem>();

	@Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
	@Input() pageSize: number = 10;
	@Input() pageIndex: number = 0;
	@Input() listId: string = 'list-id';

	@Output() pageChange = new EventEmitter<{
		pageIndex: number;
		pageSize: number;
	}>();

	isMobile = false;
	openedMenuRow: TItem | null = null;

	constructor(private store: Store) {
		this.checkMobile();
	}

	@HostListener("window:resize")
	onResize() {
		this.checkMobile();
	}

	private checkMobile() {
		this.isMobile = window.innerWidth <= 600;
	}

	toggleMenu(row: TItem) {
		this.openedMenuRow = this.openedMenuRow === row ? null : row;
	}

	closeMenu() {
		this.openedMenuRow = null;
	}

	editRow(row: TItem) {
		this.edit.emit(row);
	}

	deleteRow(row: TItem) {
		this.delete.emit(row);
	}

	onPageSizeChange(event: Event) {
		const value = +(event.target as HTMLSelectElement).value;
		this.pageSize = value;
		this.pageIndex = 0;
		this.store.dispatch(
			listActions.pageChanged({
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				listId: this.listId
			})
		);
	}

	onPageChange(delta: number) {
		this.totalPages
			?.subscribe((tp) => {
				const totalPages = tp ?? 1;
				const newIndex = this.pageIndex + delta;
				if (newIndex >= 0 && newIndex < totalPages) {
					this.pageIndex = newIndex;
					this.store.dispatch(
						listActions.pageChanged({
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							listId: this.listId
						})
					);
				}
			})
			.unsubscribe();
	}
}
