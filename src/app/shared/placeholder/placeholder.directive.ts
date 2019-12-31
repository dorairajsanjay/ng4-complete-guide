import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirective {
    public get viewContainerRef(): ViewContainerRef {
        return this._viewContainerRef;
    }
    public set viewContainerRef(value: ViewContainerRef) {
        this._viewContainerRef = value;
    }
    constructor(private _viewContainerRef: ViewContainerRef) {}
}
