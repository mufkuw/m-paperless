import { Injectable, Injector, OnInit } from '@angular/core';
import { Hooks } from './hook.enum';
import { hookRegistrars, OnHookRegistration } from './hook.registrar';
export * from './hook.enum';
export * from './hook.registrar';
export * from './hook/hook.component';

@Injectable({
    providedIn: 'root',
})
export class HookService {


    constructor(private injector: Injector) {


    }

    // Store hooks with registrar information and their closures
    private hooks: { [hookName: string]: { registrar: string, closure: (input: any) => any }[] } = {};

    public Hooks = Hooks

    bootstrapRegistrars() {

        hookRegistrars.forEach((component) => {
            // Dynamically create component instance
            const componentInstance = this.injector.get(component) as OnHookRegistration;
            if (componentInstance && typeof componentInstance.pngxHookRegistration === 'function') {
                componentInstance.pngxHookRegistration();
            }
        });

    }

    /**
     * Registers a hook with a closure (function) and a registrar name.
     * @param hookName The name of the hook.
     * @param registrar The string name of the registrar (module or component).
     * @param closure The closure function that will process the input and return the result.
     */
    registerHook<T>(hookName: string, registrar: string, closure: (input: any) => T): void {
        if (!this.hooks[hookName]) {
            this.hooks[hookName] = [];
        }

        console.log("registering " + hookName)

        // Add closure along with the registrar's identity
        this.hooks[hookName].push({ registrar, closure });
    }


    /**
     * Triggers a hook and executes all registered closures, returning their results along with the registrar names.
     * @param hookName The name of the hook to trigger.
     * @param input The input data to pass to the closures.
     * @returns An array of objects, each containing the registrar name and the closure's output.
     */
    triggerHook(hookName: string, input: any): { registrar: string, output: any }[] {
        console.log("triggering " + hookName)

        if (!this.hooks[hookName]) {
            return [];
        }

        // Collect the output from all closures and associate it with their registrar
        return this.hooks[hookName].map(({ registrar, closure }) => {
            const output = closure(input);
            return { registrar, output };
        });

    }

}



