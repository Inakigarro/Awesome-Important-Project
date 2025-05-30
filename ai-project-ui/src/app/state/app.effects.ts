import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { appInit, appInitSuccess, appInitFailure } from "./app.actions";
import { catchError, map, of, switchMap, take } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AppEffects {
	constructor(private actions$: Actions, private authService: AuthService) {}
}
