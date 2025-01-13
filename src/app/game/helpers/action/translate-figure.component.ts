import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GAP_PX } from '../../injection-tokens';
import { FigureComponent } from '../../components/figure/figure.component';
import { FigureService } from '../figure.service';
import { FieldService } from '../field.service';

@Directive({ selector: '[appTranslateFigure]', standalone: true })
export class TranslateFigureDirective {
  private readonly _cellSize = toSignal(inject(FieldService).cellSize$);
  private readonly _figureService = inject(FigureService);
  private readonly _gap = inject(GAP_PX);
  private readonly _fieldService = inject(FieldService);
  private readonly _elementRef = inject(ElementRef<FigureComponent>);

  private readonly _position = toSignal(this._figureService.position$);
  private readonly _figure = toSignal(this._figureService.figureView$);

  @HostBinding('style.transform') get getTranslate(): string {
    return this._translate();
  }

  private readonly _translate = computed(() => {
    const position = this._position();
    const cellSize = this._cellSize();
    const figure = this._figure();
    if (!position || !cellSize || !figure) {
      return '';
    }
    if (!this._fieldService.canMove(figure, position)) {
      return this._elementRef.nativeElement.style.transform;
    }
    const x = this._positionToPixel(position.x, cellSize);
    const y = this._positionToPixel(position.y, cellSize);
    return `translate(${x}px, ${y}px)`;
  });

  private _positionToPixel(position: number, cellSize: number): number {
    return cellSize * position + this._gap * position;
  }
}
