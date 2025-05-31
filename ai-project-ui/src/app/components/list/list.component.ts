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

@Component({
	selector: "app-list",
	standalone: true,
	imports: [CommonModule],
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

	@Output() pageChange = new EventEmitter<{
		pageIndex: number;
		pageSize: number;
	}>();

	isMobile = false;
	openedMenuRow: TItem | null = null;

	constructor() {
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
		this.pageChange.emit({
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
		});
	}

	onPageChange(delta: number) {
		// Como totalPages es un observable, necesitamos obtener su valor actual para validar el rango
		this.totalPages
			?.subscribe((tp) => {
				const totalPages = tp ?? 1;
				const newIndex = this.pageIndex + delta;
				if (newIndex >= 0 && newIndex < totalPages) {
					this.pageIndex = newIndex;
					this.pageChange.emit({
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
					});
				}
			})
			.unsubscribe();
	}
}
