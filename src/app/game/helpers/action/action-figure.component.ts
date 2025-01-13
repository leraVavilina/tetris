import { Directive, HostListener, inject, input } from '@angular/core';
import { FigureService } from '../figure.service';
import { Coordinates } from '../../model/cell.model';

@Directive({ selector: '[appActionFigure]', standalone: true })
export class ActionFigureDirective {
  private readonly _figureService = inject(FigureService);
  readonly position = input.required<Coordinates>({ alias: 'appActionFigure' });

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      // left click
      this._figureService.generateNewFigure();
      this._figureService.setPosition(this.position());
    }
    if (event.button === 2) {
      // right click
      this._figureService.rotate();
      this._figureService.setPosition(this.position());
    }
  }

  @HostListener('contextmenu', ['$event']) contextmenu(event: MouseEvent) {
    event.preventDefault();
  }
}
