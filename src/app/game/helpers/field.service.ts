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

  readonly minWidth = 10;
  readonly maxWidth = 13;
  readonly minHeight = 8;
  readonly maxHeight = 18;

  private readonly _widthSubject = new BehaviorSubject<number>(7);
  private readonly _heightSubject = new BehaviorSubject<number>(8);
  private readonly _cellSubject = new BehaviorSubject<Cell[][]>([]);

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
    this._cellSubject.next(
      Array.from(
        { length: this.getHeight() },
        () => new Array(this.getWidth()),
      ),
    );
  }

  setWidth(width: number) {
    this._widthSubject.next(width);
  }

  setHeight(height: number) {
    this._heightSubject.next(height);
  }

  getWidth(): number {
    return this._widthSubject.value;
  }

  getHeight(): number {
    return this._heightSubject.value;
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

  isCellOccupied(figure: FigureView, position: Coordinates): boolean {
    for (let i = 0; i < figure.length; i++) {
      for (let j = 0; j < figure[0].length; j++) {
        if (figure[i][j] && this.cells[position.y + i][position.x + j]) {
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

  setFigure(figure: FigureView, color: Color, position: Coordinates) {
    const cells = this._cellSubject.value;
    for (let x = 0; x < figure.length; x++) {
      for (let y = 0; y < figure[0].length; y++) {
        if (figure[x][y]) {
          cells[position.y + x][position.x + y] = { color };
        }
      }
    }
  }
}
