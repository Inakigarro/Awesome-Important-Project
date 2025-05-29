import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err)
);

// Detectar cambios de clase en el body para tema oscuro/claro
const origSetAttribute = document.body.setAttribute;
document.body.setAttribute = function (attr: string, value: string) {
	if (attr === "class") {
		const event = new Event("classChange");
		setTimeout(() => document.body.dispatchEvent(event), 0);
	}
	return origSetAttribute.call(this, attr, value);
};
