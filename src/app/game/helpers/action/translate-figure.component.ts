import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  inject,
} from '@angular/core';
import { CellService } from '../cell.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GAP_PX } from '../../injection-tokens';
import { GameService } from '../game.service';
import { FigureComponent } from '../../components/figure/figure.component';
import { FigureService } from '../figure.service';

@Directive({ selector: '[appTranslateFigure]', standalone: true })
export class TranslateFigureDirective {
  private readonly _cellSize = toSignal(inject(CellService).cellSize$);
  private readonly _figureService = inject(FigureService);
  private readonly _gap = inject(GAP_PX);
  private readonly _gameService = inject(GameService);
  private readonly _position = toSignal(this._figureService.position$);
  private readonly _figure = toSignal(this._figureService.figureView$);
  private readonly _elementRef = inject(ElementRef<FigureComponent>);

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
    if (!this._gameService.canMove(figure, position)) {
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
