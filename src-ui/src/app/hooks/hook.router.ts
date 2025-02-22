import { Routes } from "@angular/router";
import { Hooks, HookService } from "./hook.service";

export function hookRouter(routes: Routes, hookService: HookService): Routes {

    hookService.triggerHook(Hooks.AppRoute, routes);

    return [
        ...routes
    ]
}