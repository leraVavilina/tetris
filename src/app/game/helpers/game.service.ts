import { inject, Injectable } from '@angular/core';
import { FigureType, FigureView } from '../model/tetris-component.model';
import { Coordinates } from '../model/cell.model';
import { CellService } from './cell.service';
import { FIGURE_VIEW, isFigureType } from '../model/figure.consts';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GameService {
  private readonly _cellService = inject(CellService);
  private readonly _positionSubject = new BehaviorSubject<Coordinates>({
    x: 0,
    y: 0,
  });
  private readonly _figureTypeSubject = new BehaviorSubject<
    FigureType | undefined
  >('L');

  readonly position$ = this._positionSubject.asObservable();
  readonly figureType = this._figureTypeSubject.asObservable();

  isAboard(figure: FigureView, position: Coordinates): boolean {
    const cells = this._cellService.cells;

    if (!cells.length) {
      return true;
    }
    return (
      figure[0].length + position.x > cells[0].length ||
      figure.length + position.y > cells.length
    );
  }

  isCellOccupied(figure: FigureView, position: Coordinates): boolean {
    for (let i = 0; i < figure.length; i++) {
      for (let j = 0; j < figure[0].length; j++) {
        if (
          figure[i][j] &&
          this._cellService.cells[position.x + i][position.y + j]
        ) {
          return false;
        }
      }
    }
    return true;
  }

  canMove(figure: FigureView | FigureType, position: Coordinates): boolean {
    if (isFigureType(figure)) {
      figure = FIGURE_VIEW[figure];
    }
    if (this.isAboard(figure, position)) {
      return false;
    }
    return this.isCellOccupied(figure, position);
  }
}
