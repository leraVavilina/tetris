import { computed, Directive, HostBinding, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GAP_PX } from '../../injection-tokens';
import { FieldService } from '../field.service';
import { Coordinates } from '../../model/cell.model';

@Directive({ selector: '[appTranslateFigure]', standalone: true })
export class TranslateFigureDirective {
  private readonly _cellSize = toSignal(inject(FieldService).cellSize$);
  private readonly _gap = inject(GAP_PX);

  readonly position = input.required<Coordinates>();

  @HostBinding('style.transform') get getTranslate(): string {
    return this._translate();
  }

  private readonly _translate = computed(() => {
    const position = this.position();
    const cellSize = this._cellSize();
    if (!cellSize) {
      return '';
    }
    const x = this._positionToPixel(position.x, cellSize);
    const y = this._positionToPixel(position.y, cellSize);
    return `translate(${x}px, ${y}px)`;
  });

  private _positionToPixel(position: number, cellSize: number): number {
    return cellSize * position + this._gap * position;
  }
}
