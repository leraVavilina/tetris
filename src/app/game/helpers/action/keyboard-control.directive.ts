import { Directive, HostListener, inject } from '@angular/core';
import { FigureService } from '../figure.service';
import { PlayService } from '../play.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Directive({ selector: '[appKeyboardControl]', standalone: true })
export class KeyboardControlDirective {
  private readonly _figureService = inject(FigureService);
  private readonly _playService = inject(PlayService);
  private readonly _position = toSignal(this._figureService.position$);

  @HostListener('document:keydown', ['$event']) onMouseDown(
    event: KeyboardEvent,
  ) {
    const position = this._position();
    if (!position) {
      return;
    }
    if (event.code === 'ArrowLeft') {
      this._figureService.horizontalMove(position.x - 1);
    }
    if (event.code === 'ArrowRight') {
      this._figureService.horizontalMove(position.x + 1);
    }
    if (event.code === 'ArrowDown' && !event.repeat) {
      this._playService.speedUp(2);
    }
    if (event.code === 'ArrowUp' && !event.repeat) {
      this._figureService.rotate();
    }
    if (event.code === 'Space') {
      this._figureService.putFigure();
    }
    if (event.code === 'KeyZ' && !event.repeat) {
      this._figureService.rotate(false);
    }
    if (event.code === 'KeyX' && !event.repeat) {
      this._figureService.rotate();
    }
    if (event.code === 'Escape' && !event.repeat) {
      this._playService.setIsPlay(!this._playService.getIsPlay());
    }
  }

  @HostListener('document:keyup', ['$event']) onMouseUp(event: KeyboardEvent) {
    if (event.code === 'ArrowDown') {
      this._playService.speedDown(2);
    }
  }
}
