import { inject, Injectable } from '@angular/core';
import { Coordinates } from '../model/cell.model';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Figure,
  FIGURE_VIEW,
  FigureType,
  FigureView,
} from '../model/figure.consts';
import { Color } from '../model/color.model';
import { FieldService } from './field.service';

@Injectable()
export class FigureService {
  private readonly _fieldService = inject(FieldService);
  private readonly _positionSubject = new BehaviorSubject<Coordinates>(
    this.getDefaultPosition(),
  );
  private readonly _figureSubject = new BehaviorSubject<Figure | undefined>(
    undefined,
  );
  private readonly _figureViewSubject = new BehaviorSubject<
    FigureView | undefined
  >(undefined);
  private readonly _nextFigureSubject = new BehaviorSubject<Figure[]>([]);

  readonly position$ = this._positionSubject.pipe(
    distinctUntilChanged(
      (prevPos, curPos) => prevPos.x === curPos.x && prevPos.y === curPos.y,
    ),
  );
  readonly figure$ = this._figureSubject.asObservable();
  readonly figureView$ = this._figureViewSubject.asObservable();
  readonly nextFigure$ = this._nextFigureSubject.asObservable();

  constructor() {
    this._figureSubject.pipe(takeUntilDestroyed()).subscribe((figure) => {
      figure && this._figureViewSubject.next(FIGURE_VIEW[figure.type]);
    });

    this._figureSubject.next(this._randomFigure());
    this._nextFigureSubject.next([
      this._randomFigure(),
      this._randomFigure(),
      this._randomFigure(),
    ]);
  }

  getDefaultPosition(): Coordinates {
    return { x: Math.floor(this._fieldService.cells[0].length / 2) - 1, y: 0 };
  }

  getPosition(): Coordinates {
    return this._positionSubject.value;
  }

  setPosition(position: Coordinates) {
    const view = this._figureViewSubject.value;
    if (!view) {
      return;
    }
    const lastIndexX = this._fieldService.cells[0].length - view[0].length;
    const lastIndexY = this._fieldService.cells.length - view.length;
    const newPosition = { x: position.x, y: position.y };
    if (newPosition.x > lastIndexX) {
      newPosition.x = lastIndexX;
    }
    if (newPosition.y > lastIndexY) {
      newPosition.y = lastIndexY;
    }
    if (this._fieldService.canMove(view, newPosition)) {
      this._positionSubject.next(newPosition);
    }
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
    if (this._fieldService.canMove(result, this._positionSubject.value)) {
      this._figureViewSubject.next(result);
    }
  }

  setNextFigure() {
    const next = this._nextFigureSubject.value;
    if (!next.length) {
      return;
    }
    const figure = next.shift();
    this._figureSubject.next(figure);
    next.push(this._randomFigure());
  }

  horizontalMove(x: number) {
    const { y } = this._positionSubject.value;
    this.setPosition({ x, y });
  }

  downFigure() {
    const curPosition = this._positionSubject.value;
    const view = this._figureViewSubject.value;
    4;
    const newPosition = {
      x: curPosition.x,
      y: curPosition.y + 1,
    };
    if (!view) {
      throw new Error('figure is undefined');
    }
    if (!this._fieldService.canMove(view, newPosition)) {
      this.setFigure();
      this._positionSubject.next(this.getDefaultPosition());
      this.setNextFigure();
    } else {
      this._positionSubject.next(newPosition);
    }
  }

  setFigure() {
    const view = this._figureViewSubject.value;
    const curFigure = this._figureSubject.value;
    if (!view || !curFigure) {
      throw new Error('figure is undefined');
    }
    this._fieldService.setFigure(
      view,
      curFigure.color,
      this._positionSubject.value,
    );
  }

  private _randomFigure(): Figure {
    const nextFigure = this._nextFigureSubject.value;
    let color = Color[Math.floor(Math.random() * (Color.length - 1))];
    let type = FigureType[Math.floor(Math.random() * FigureType.length)];

    return { type, color };
  }
}
