import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';
import { CellService } from '../cell.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GAP_PX } from '../../injection-tokens';
import { GameService } from '../game.service';
import { FigureView } from '../../model/tetris-component.model';
import { FigureComponent } from '../../components/figure/figure.component';
import { FigureService } from '../figure.service';

@Directive({ selector: '[appTranslateFigure]', standalone: true })
export class TranslateFigureDirective {
  private readonly _cellSize = toSignal(inject(CellService).cellSize$);
  private readonly _gap = inject(GAP_PX);
  private readonly _gameService = inject(GameService);
  private readonly _position = toSignal(inject(FigureService).position$);
  private readonly _elementRef = inject(ElementRef<FigureComponent>);

  readonly figure = input.required<FigureView>();

  @HostBinding('style.transform') get getTranslate(): string {
    return this._translate();
  }

  private readonly _translate = computed(() => {
    const position = this._position();
    const cellSize = this._cellSize();
    if (!position || !cellSize) {
      return '';
    }
    if (!this._gameService.canMove(this.figure(), position)) {
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
