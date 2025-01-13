import { inject, Injectable } from '@angular/core';
import { FigureType, FigureView } from '../model/tetris-component.model';
import { Coordinates } from '../model/cell.model';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { CellService } from './cell.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FIGURE_VIEW } from '../model/figure.consts';

@Injectable()
export class FigureService {
  private readonly _cellService = inject(CellService);
  private readonly _positionSubject = new BehaviorSubject<Coordinates>({
    x: 0,
    y: 0,
  });
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
    if (position.x > lastIndexX) {
      position.x = lastIndexX;
    }
    if (position.y > lastIndexY) {
      position.y = lastIndexY;
    }
    this._positionSubject.next(position);
  }
}
