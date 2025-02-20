import { Type } from "@angular/core";
import { SignaturesComponent } from "../manage/signatures/signatures.component";

export interface OnHookRegistration {
    pngxHookRegistration(): void;
}


export const hookRegistrars: Type<OnHookRegistration>[] = [
    SignaturesComponent
]




