import { Injectable } from "@angular/core";
import {
	Router,
	NavigationEnd,
	Event as NavigationEvent,
} from "@angular/router";
import { filter, pairwise, startWith, map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

export interface NavigationState {
	previousUrl: string | null;
	currentUrl: string;
	nextUrl: string | null;
	isSubroute: boolean;
	isFullRouteChange: boolean;
}

@Injectable({ providedIn: "root" })
export class NavigationService {
	private previousUrl: string | null = null;
	private currentUrl: string = "";
	private nextUrl: string | null = null;
	private navigationState$ = new BehaviorSubject<NavigationState>({
		previousUrl: null,
		currentUrl: "",
		nextUrl: null,
		isSubroute: false,
		isFullRouteChange: false,
	});

	constructor(private router: Router) {
		this.router.events
			.pipe(
				filter(
					(event: NavigationEvent): event is NavigationEnd =>
						event instanceof NavigationEnd
				),
				startWith({ urlAfterRedirects: this.router.url } as NavigationEnd),
				pairwise()
			)
			.subscribe(([prev, curr]: [NavigationEnd, NavigationEnd]) => {
				this.previousUrl = prev.urlAfterRedirects;
				this.currentUrl = curr.urlAfterRedirects;
				this.nextUrl = null;
				const isSubroute = this.isSubroute(this.previousUrl, this.currentUrl);
				const isFullRouteChange = !isSubroute;
				this.navigationState$.next({
					previousUrl: this.previousUrl,
					currentUrl: this.currentUrl,
					nextUrl: null,
					isSubroute,
					isFullRouteChange,
				});
			});
	}

	public getNavigationState() {
		return this.navigationState$.asObservable();
	}

	public getCurrentUrl(): string {
		return this.currentUrl;
	}

	public getPreviousUrl(): string | null {
		return this.previousUrl;
	}

	public navigate(url: string): void {
		this.nextUrl = url;
		const isSubroute = this.isSubroute(this.currentUrl, url);
		const isFullRouteChange = !isSubroute;
		this.navigationState$.next({
			previousUrl: this.currentUrl,
			currentUrl: url,
			nextUrl: url,
			isSubroute,
			isFullRouteChange,
		});
		this.router.navigateByUrl(url);
	}

	private isSubroute(from: string | null, to: string): boolean {
		if (!from) return false;
		// Considera subruta si el inicio de la ruta es igual y solo cambia el segmento final
		const fromSegments = from.split("/").filter(Boolean);
		const toSegments = to.split("/").filter(Boolean);
		if (fromSegments.length === 0 || toSegments.length === 0) return false;
		if (fromSegments[0] !== toSegments[0]) return false;
		// Si solo cambia el último segmento o se agrega uno, es subruta
		if (
			toSegments.length > fromSegments.length &&
			toSegments.slice(0, fromSegments.length).join("/") ===
				fromSegments.join("/")
		) {
			return true;
		}
		if (
			fromSegments.length > toSegments.length &&
			fromSegments.slice(0, toSegments.length).join("/") ===
				toSegments.join("/")
		) {
			return true;
		}
		return false;
	}
}
