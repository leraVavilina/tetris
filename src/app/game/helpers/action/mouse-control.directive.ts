import { Directive, HostListener, inject } from '@angular/core';
import { FigureService } from '../figure.service';
import { PlayService } from '../play.service';

const BUTTON_MAP: Record<'left' | 'right', number> = {
  left: 0,
  right: 2,
};

@Directive({ selector: '[appMouseControl]', standalone: true })
export class MouseControlDirective {
  private readonly _figureService = inject(FigureService);
  private readonly _playService = inject(PlayService);

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if (event.button === BUTTON_MAP.left) {
      this._playService.speedUp(2);
    }
    if (event.button === BUTTON_MAP.right) {
      this._figureService.rotate();
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

  @HostListener('document:contextmenu', ['$event']) contextmenu(
    event: MouseEvent,
  ) {
    event.preventDefault();
  }
}
