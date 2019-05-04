import {Directive, Input, ElementRef, Renderer} from '@angular/core';
import {DomController} from 'ionic-angular';

@Directive({selector: '[dragable]'})
export class Dragable {

    @Input('startLeft')startLeft : any;
    @Input('startTop')startTop : any;

    constructor(public element : ElementRef, public renderer : Renderer, public domCtrl : DomController) {}

    ngAfterViewInit() {

        // this.renderer.setElementStyle(this.element.nativeElement, 'position',
        // 'fixed');
        this
            .renderer
            .setElementStyle(this.element.nativeElement, 'left', this.startLeft + 'px');
        this
            .renderer
            .setElementStyle(this.element.nativeElement, 'top', this.startTop + 'px');

        this
            .element
            .nativeElement(this.element.nativeElement);

    }

    handlePan(ev) {
        let newLeft = ev.center.x - ev.target.clientWidth / 2;
        let newTop = ev.center.y - ev.target.clientHeight / 2;
        newLeft = newLeft >= 0
            ? newLeft
            : 0;
        newTop = newTop >= 0
            ? newTop
            : 0;

        this
            .domCtrl
            .write(() => {
                this
                    .renderer
                    .setElementStyle(this.element.nativeElement, 'left', newLeft + 'px');
                this
                    .renderer
                    .setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
            });

    }

}