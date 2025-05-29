import { Injectable } from "@angular/core";
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router,
} from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class SpinnerService {
	private _loading = new BehaviorSubject<boolean>(false);
	public readonly loading$ = this._loading.asObservable();
	private _pendingRequests = 0;

	constructor(router: Router) {
		router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.show();
			} else if (
				event instanceof NavigationEnd ||
				event instanceof NavigationCancel ||
				event instanceof NavigationError
			) {
				this.hide();
			}
		});
	}

	show(): void {
		this._pendingRequests++;
		this._loading.next(true);
	}

	hide(): void {
		if (this._pendingRequests > 0) {
			this._pendingRequests--;
		}
		if (this._pendingRequests === 0) {
			this._loading.next(false);
		}
	}

	reset(): void {
		this._pendingRequests = 0;
		this._loading.next(false);
	}
}
