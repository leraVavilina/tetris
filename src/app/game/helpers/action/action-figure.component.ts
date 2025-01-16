import { Directive, HostListener, inject, input } from '@angular/core';
import { FigureService } from '../figure.service';
import { Coordinates } from '../../model/cell.model';
import { PlayService } from '../play.service';

const BUTTON_MAP: Record<'left' | 'right', number> = {
  left: 0,
  right: 2,
};

@Directive({ selector: '[appActionFigure]', standalone: true })
export class ActionFigureDirective {
  private readonly _figureService = inject(FigureService);
  private readonly _playService = inject(PlayService);
  readonly position = input.required<Coordinates>({ alias: 'appActionFigure' });

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if (event.button === BUTTON_MAP.left) {
      this._playService.speedUp(2);
    }
    if (event.button === BUTTON_MAP.right) {
      this._figureService.rotate();
      this._figureService.horizontalMove(this.position().x);
    }
  }

  @HostListener('dblclick', ['$event']) onDblClick(event: MouseEvent) {
    if (event.button === BUTTON_MAP.left) {
      this._figureService.putFigure();
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    if (event.button === BUTTON_MAP.left) {
      this._playService.speedDown(2);
    }
  }

  @HostListener('contextmenu', ['$event']) contextmenu(event: MouseEvent) {
    event.preventDefault();
  }
}
