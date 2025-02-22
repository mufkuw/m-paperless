import { Component, Input, OnInit, ContentChild, TemplateRef, AfterViewInit, Directive, ViewContainerRef, SimpleChanges, OnChanges } from '@angular/core';
import { Hooks, HookService } from './hook.service'; // Assume HookService triggers hooks.
import { CommonModule } from '@angular/common';

// @Directive({
//   selector: '[pngxHook]',
// })
// export class HookComponent implements OnInit {
//   @Input() hookName: string = '';  // Name of the hook
//   @Input() hookParam: any = {};    // Data to pass to the hook

//   @Input() set pngxHook(output: string) {

//     this.outputs.forEach(item => {
//       console.log(item);
//       this.viewContainer.createEmbeddedView(this.templateRef, {
//         [output]: item,
//         $implicit: item  // Assign 'output' to '$implicit'
//       });
//     })

//   }

//   hookResults: { registrar: string, output: any[] }[] = [];  // Results from the hook  

//   public get outputs(): any[] {
//     return this.hookResults
//       .map(result => result.output) // Extract 'output' from each object
//       .flat()
//   }


//   // // Content projection with TemplateRef
//   // @ContentChild('hookTemplate') hookTemplate: TemplateRef<any> | null = null;

//   constructor(
//     private hookService: HookService,
//     private templateRef: TemplateRef<any>,  // Template reference
//     private viewContainer: ViewContainerRef  // View container to render the template
//   ) { }


//   ngOnInit(): void {
//     if (this.hookName && this.hookParam) {
//       this.triggerHook();
//     }
//   }

//   // Method to trigger the hook and get results
//   triggerHook(): void {
//     this.hookResults = this.hookService.triggerHook(this.hookName, this.hookParam);
//   }
// }



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


  triggerHook(): void {
    // this.hookResults = this.hookService.triggerHook(this.pngxHook.name || this.pngxHook , this.pngxHook.param);
  }
}
