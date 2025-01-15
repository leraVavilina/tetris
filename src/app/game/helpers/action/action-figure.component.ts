import { Directive, HostListener, inject, input } from '@angular/core';
import { FigureService } from '../figure.service';
import { Coordinates } from '../../model/cell.model';
import { PlayService } from '../play.service';

@Directive({ selector: '[appActionFigure]', standalone: true })
export class ActionFigureDirective {
  private readonly _figureService = inject(FigureService);
  private readonly _playService = inject(PlayService);
  readonly position = input.required<Coordinates>({ alias: 'appActionFigure' });

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      // left click
      this._playService.setSpeed('fast');
    }
    if (event.button === 2) {
      // right click
      this._figureService.rotate();
      this._figureService.horizontalMove(this.position().x);
    }
  }
  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      // left click
      this._playService.setSpeed('default');
    }
  }

  @HostListener('contextmenu', ['$event']) contextmenu(event: MouseEvent) {
    event.preventDefault();
  }
}
