import { Routes } from "@angular/router";
import { SignaturesComponent } from "../manage/signatures/signatures.component";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { PermissionAction, PermissionType } from "src/app/services/permissions.service";
import { Hooks, HookService } from "./hook.service";
import { AppFrameComponent } from "../app-frame/app-frame.component";

export function hookRouter(routes: Routes, hookService: HookService): Routes {

    hookService.triggerHook(Hooks.AppRoute, routes);

    return [
        ...routes
    ]
}