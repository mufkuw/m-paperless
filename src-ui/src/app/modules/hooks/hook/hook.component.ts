import { Component, Input, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { HookService } from '../hook.service';


@Component({
  selector: 'pngx-hook',
  templateUrl: './hook.component.html',
  styleUrl: './hook.component.scss'
})
export class HookComponent implements OnInit {
  @Input() hookName: string = '';  // The name of the hook to trigger
  @Input() inputData: any = {};    // Data to pass to the hook

  hookResult: { registrar: string, output: any }[] = [];  // Store the results of the triggered hook

  // Allow content projection using a TemplateRef
  @ContentChild(TemplateRef) templateRef: TemplateRef<any> | null = null;

  constructor(private hookService: HookService) { }

  ngOnInit(): void {
    if (this.hookName && this.inputData) {
      this.triggerHook();
    }
  }

  // Trigger the hook and collect results
  triggerHook(): void {
    this.hookResult = this.hookService.triggerHook(this.hookName, this.inputData);
  }
}
