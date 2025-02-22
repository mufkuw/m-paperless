import { NgModule, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { hookRegistrars, HookService, OnHookRegistration } from './hook.service'; // Assuming you still want a service to manage the hooks

@NgModule({
    declarations: [],
    imports: [CommonModule,], // Or other necessary modules
    providers: [HookService, ...hookRegistrars], // Providing the service at the module level
    exports: []
})

export class HookModule implements OnInit {

    constructor(private injector: Injector) {
        // Initialize hook registrars here
        // this.bootstrapRegistrars();
    }


    ngOnInit(): void {
        this.bootstrapRegistrars();
    }

    bootstrapRegistrars() {
        // Dynamically create component instances
        console.log("bootstrapRegistrars");
        hookRegistrars.forEach((component) => {
            const componentInstance = this.injector.get(component) as OnHookRegistration;
            if (componentInstance && typeof componentInstance.pngxHookRegistration === 'function') {
                componentInstance.pngxHookRegistration();
            }
        });
    }
}
