import { computed, Directive, HostBinding, inject, input } from '@angular/core';
import { FieldService } from '../field.service';
import { Coordinates } from '../../model/cell.model';

@Directive({ selector: '[appTranslateFigure]', standalone: true })
export class TranslateFigureDirective {
  private readonly _fieldService = inject(FieldService);
  readonly position = input.required<Coordinates>();

  @HostBinding('style.transform') get getTranslate(): string {
    return this._translate();
  }

  private readonly _translate = computed(() => {
    const position = this.position();
    const x = this._fieldService.positionToPixel(position.x);
    const y = this._fieldService.positionToPixel(position.y);
    return `translate(${x}px, ${y}px)`;
  });
}
