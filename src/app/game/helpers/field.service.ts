import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
} from 'rxjs';
import {
  FIGURE_VIEW,
  FigureType,
  FigureView,
  isFigureType,
} from '../model/figure.consts';
import { Cell, Coordinates } from '../model/cell.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GAP_PX, WIDTH_FIELD_PX } from '../injection-tokens';
import { Color } from '../model/color.model';

@Injectable()
export class FieldService {
  private readonly _widthPx = inject(WIDTH_FIELD_PX);
  private readonly _gapPx = inject(GAP_PX);

  private readonly _widthSubject = new BehaviorSubject<number>(6);
  private readonly _heightSubject = new BehaviorSubject<number>(10);
  private readonly _cellSubject = new BehaviorSubject<Cell[][]>([]);
  private readonly _scoreSubject = new BehaviorSubject<number>(0);

  readonly score$ = this._scoreSubject.asObservable();
  readonly width$ = this._widthSubject.pipe(distinctUntilChanged());
  readonly height$ = this._heightSubject.pipe(distinctUntilChanged());
  readonly cells$ = this._cellSubject.asObservable();
  readonly cellSize$ = this.width$.pipe(
    map((width) => {
      return Math.floor((this._widthPx - (width - 1) * this._gapPx) / width);
    }),
  );

  get cells(): Cell[][] {
    return this._cellSubject.value;
  }

  constructor() {
    combineLatest([this.height$, this.width$])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.newField());
  }

  newField() {
    // !!!!!! each slot in the array will reference that object
    this._cellSubject.next(
      Array.from({ length: this._heightSubject.value }, () =>
        new Array<Cell>(this._widthSubject.value).fill({
          color: 'default',
          isFree: true,
        }),
      ),
    );
  }

  setWidth(width: number) {
    this._widthSubject.next(width);
  }

  setHeight(height: number) {
    this._heightSubject.next(height);
  }

  isAboard(figure: FigureView, position: Coordinates): boolean {
    const cells = this.cells;

    if (!cells.length) {
      return true;
    }
    return (
      figure[0].length + position.x > cells[0].length ||
      figure.length + position.y > cells.length
    );
  }

  isCellFree(figure: FigureView, position: Coordinates): boolean {
    for (let i = 0; i < figure.length; i++) {
      for (let j = 0; j < figure[0].length; j++) {
        if (
          figure[i][j] &&
          !this.cells[position.y + i][position.x + j].isFree
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
    return this.isCellFree(figure, position);
  }

  setFigure(figure: FigureView, color: Color, position: Coordinates) {
    const cells = this._cellSubject.value;
    for (let x = 0; x < figure.length; x++) {
      for (let y = 0; y < figure[0].length; y++) {
        if (figure[x][y]) {
          cells[position.y + x][position.x + y] = { color, isFree: false };
        }
      }
    }
    this._checkFillLines();
  }

  lowestPosition(view: FigureView, position: Coordinates): Coordinates {
    const test = { x: position.x, y: position.y };
    while (this.canMove(view!, test)) {
      test.y++;
    }
    test.y--;
    return test;
  }

  private _checkFillLines() {
    const cells = this._cellSubject.value;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].every(({ isFree }) => !isFree)) {
        this._scoreSubject.next(
          this._scoreSubject.value + this._widthSubject.value,
        );
        for (let j = i; j > 0; j--) {
          cells[j] = [...cells[j - 1]];
        }
      }
    }
    this._cellSubject.next(cells);
  }
}
