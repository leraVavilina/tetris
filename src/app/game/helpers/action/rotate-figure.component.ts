import { Directive, ElementRef, inject, input } from '@angular/core';
import { Coordinates } from '../../model/cell.model';
import { CellService } from '../cell.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GAP_PX } from '../../injection-tokens';
import { GameService } from '../game.service';
import { FigureView } from '../../model/tetris-component.model';
import { FigureComponent } from '../../components/figure/figure.component';

@Directive({ selector: '[appRotateFigure]', standalone: true })
export class RotateFigureDirective {
  private readonly _cellSize = toSignal(inject(CellService).cellSize$);
  private readonly _gap = inject(GAP_PX);
  private readonly _gameService = inject(GameService);
  private readonly _elementRef = inject(ElementRef<FigureComponent>);

  readonly position = input.required<Coordinates>();
  readonly figure = input.required<FigureView>();
}
