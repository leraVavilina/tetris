import { Directive, HostListener, inject, Output } from '@angular/core';
import { Coordinates } from '../../model/cell.model';
import { FieldService } from '../field.service';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';

@Directive({ selector: '[appHoverPosition]' })
export class HoverPositionDirective {
  private readonly _fieldService = inject(FieldService);
  private readonly _hoverPositionSubject = new ReplaySubject<Coordinates>(1);

  @Output('appHoverPosition')
  readonly hoverPosition = this._hoverPositionSubject.pipe(
    distinctUntilChanged((prevPos, curPos) => {
      return prevPos.x === curPos.x && prevPos.y === curPos.y;
    }),
  );

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    const x = this._fieldService.pixelToPosition(event.offsetX);
    const y = this._fieldService.pixelToPosition(event.offsetY);
    this._hoverPositionSubject.next({ x, y });
  }
}
