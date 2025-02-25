import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { OnHookRegistration } from 'src/app/hooks/hook.registrar';
import { Hooks, HookService } from 'src/app/hooks/hook.service';
import { AppFrameComponent } from '../app-frame/app-frame.component';
import { PageHeaderComponent } from "../common/page-header/page-header.component";
import {
  PermissionAction,
  PermissionsService,
} from 'src/app/services/permissions.service'
import { ComponentWithPermissions } from '../with-permissions/with-permissions.component';
import { IfPermissionsDirective } from 'src/app/directives/if-permissions.directive'
import { CommonModule } from '@angular/common';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorChromeModule } from 'ngx-color/chrome';
import { Color } from 'ngx-color';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isConditionalExpression } from 'typescript';





@Component({
  selector: 'pngx-signature',
  imports: [CommonModule,
    PageHeaderComponent,
    IfPermissionsDirective,
    NgxBootstrapIconsModule,
    SignaturePadComponent,
    NgbPopoverModule,
    ColorChromeModule],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss'
})
export class SignatureComponent extends ComponentWithPermissions
  implements OnInit, OnDestroy, OnHookRegistration {

  constructor(private hookService: HookService, private modalService: NgbModal) {
    super();
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  @ViewChild(SignaturePadComponent) signaturePad: SignaturePadComponent;
  @ViewChild('signaturePadModal') signaturePadModal!: TemplateRef<any>;
  @ViewChild('signatureImg') signatureImg!: ElementRef<HTMLImageElement>;

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

    this.hookService.registerHook(Hooks.ExtendAppRoute, this, (routes: Routes) => {
      var r = routes.find(r => r.component == AppFrameComponent);

      if (!r) return [];

      r.children.push({
        path: "signatures",
        component: SignatureComponent
      });

      return routes
    })

  }

  penColor: string = 'red'
  signature: string = ''
  initials: string = '';

  penColorChanged(color: Color) {
    this.penColor = color.hex;
  }


  setSignatureClicked() {
    var modalRef = this.modalService.open(this.signaturePadModal, { size: "lg" });
    modalRef.result.then(x => {
      this.signature = x;
    })

  }

  setInitialsClicked() {
    var modalRef = this.modalService.open(this.signaturePadModal, { size: "lg" });
    modalRef.result.then(x => {
      this.initials = x;
    })

  }

}
