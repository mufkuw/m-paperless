import { Type } from "@angular/core";
import { SignatureComponent } from "../components/signature/signature.component";
// import { SignaturesComponent } from "../manage/signatures/signatures.component";

export interface OnHookRegistration {
    name: string
    pngxHookRegistration(): void;
}


export const hookRegistrars: Type<OnHookRegistration>[] = [
    SignatureComponent
]




