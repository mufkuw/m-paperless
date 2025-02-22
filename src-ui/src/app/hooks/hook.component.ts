import { Component, Input, OnInit, ContentChild, TemplateRef, AfterViewInit, Directive, ViewContainerRef, SimpleChanges, OnChanges } from '@angular/core';
import { Hooks, HookService } from './hook.service'; // Assume HookService triggers hooks.
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[pngxHook]',
})
export class HookComponent implements OnChanges {
  @Input() pngxHook: { name: Hooks, param?: any, output?: string } | Hooks;

  hookResults: { registrar: string, output: any[] }[] = [];

  public get outputs(): any[] {
    return this.hookResults
      .map(result => result.output) // Extract 'output' from each object
      .flat()
  }

  constructor(
    private hookService: HookService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    var output: string = "output"

    if (typeof this.pngxHook == 'string') {
      this.hookResults = this.hookService.triggerHook(this.pngxHook as Hooks, {})
    }

    if (typeof this.pngxHook == 'object' && 'name' in this.pngxHook) {
      var hook = this.pngxHook as { name: Hooks, param?: any, output?: string };
      this.hookResults = this.hookService.triggerHook(hook.name, hook.param)
      output ??= hook.output;
    }

    if (this.hookResults) {
      this.viewContainer.clear();  // Clear previous content
      this.outputs.forEach(result => {

        // Pass the context with the correct key for the template
        const context = {
          [output]: result, // Create a dynamic context with the output key
          $implicit: result, // Optional: You can also pass the result to $implicit
        };

        this.viewContainer.createEmbeddedView(this.templateRef, context);
      });
    }


    // if (this.pngxHook ) {
    //   this.pngxHook.output ??= 'output';
    //   this.triggerHook();

    //   console.log(this.outputs);

    //   this.outputs.forEach(result => {
    //     this.viewContainer.clear();  // Clear previous content
    //     this.viewContainer.createEmbeddedView(this.templateRef, {
    //       [this.pngxHook.output]: result,
    //       $implicit: result.output
    //     });
    //   });
    // }
  }
}
