import { inject, Injectable } from '@angular/core';
import { FigureType, FigureView } from '../model/tetris-component.model';
import { Coordinates } from '../model/cell.model';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { CellService } from './cell.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DEFAULT_POSITION, FIGURE_VIEW } from '../model/figure.consts';

@Injectable()
export class FigureService {
  private readonly _cellService = inject(CellService);
  private readonly _positionSubject = new BehaviorSubject<Coordinates>(
    DEFAULT_POSITION,
  );
  private readonly _figureTypeSubject = new BehaviorSubject<
    FigureType | undefined
  >('L');
  private readonly _figureViewSubject = new BehaviorSubject<
    FigureView | undefined
  >(undefined);

  readonly position$ = this._positionSubject.pipe(
    distinctUntilChanged(
      (prevPos, curPos) => prevPos.x === curPos.x && prevPos.y === curPos.y,
    ),
  );
  readonly figureType$ = this._figureTypeSubject.asObservable();
  readonly figureView$ = this._figureViewSubject.asObservable();

  constructor() {
    this._figureTypeSubject.pipe(takeUntilDestroyed()).subscribe((figure) => {
      figure && this._figureViewSubject.next(FIGURE_VIEW[figure]);
    });
  }

  setPosition(position: Coordinates) {
    const view = this._figureViewSubject.value;
    if (!view) {
      return;
    }
    const lastIndexX = this._cellService.cells[0].length - view[0].length;
    const lastIndexY = this._cellService.cells.length - view.length;
    const newPosition = { x: position.x, y: position.y };
    if (newPosition.x > lastIndexX) {
      newPosition.x = lastIndexX;
    }
    if (newPosition.y > lastIndexY) {
      newPosition.y = lastIndexY;
    }
    this._positionSubject.next(newPosition);
  }

  rotate() {
    const view = this._figureViewSubject.value;
    if (!view) {
      return;
    }
    const result = Array.from(
      { length: view[0].length },
      () => new Array(view.length),
    );
    for (let x = 0; x < view[0].length; x++) {
      for (let y = 0; y < view.length; y++) {
        result[view[0].length - x - 1][y] = view[y][x];
      }
    }
    this._figureViewSubject.next(result);
  }
}
