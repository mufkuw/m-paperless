import { Component } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { OnHookRegistration } from 'src/app/hooks/hook.registrar';
import { Hooks, HookService, SidebarManageMenuItemHookResult } from 'src/app/hooks/hook.service';
import { AppFrameComponent } from '../app-frame/app-frame.component';


@Component({
  selector: 'pngx-signature',
  imports: [],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss'
})
export class SignatureComponent implements OnHookRegistration {

  constructor(private hookService: HookService) { }
  name: string = "SignatureComponent";

  pngxHookRegistration(): void {
    this.hookService.registerHook(Hooks.SidebarManageMenuItems, this, (data) => {
      return [
        {
          icon: "vectorPen",
          menuTitle: "Signatures",
          routerLink: "/signatures",
          ngbPopover: "Signatures",
          tourAnchor: "tour.signature"
        }
      ]
    })

    this.hookService.registerHook(Hooks.AppRoute, this, (routes: Routes) => {
      var r = routes.find(r => r.component == AppFrameComponent);

      if (!r) return [];

      r.children.push({
        path: "signatures",
        component: SignatureComponent
      });

      return routes
    })

  }

}
