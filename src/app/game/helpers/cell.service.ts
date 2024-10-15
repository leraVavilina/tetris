import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Cell } from '../model/cell.model';
import { WIDTH_FIELD_PX, GAP_PX } from '../injection-tokens';
import { FieldService } from './field.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class CellService {
  private readonly _widthPx = inject(WIDTH_FIELD_PX);
  private readonly _gapPx = inject(GAP_PX);
  private readonly _fieldService = inject(FieldService);

  private readonly _cellSubject = new BehaviorSubject<Cell[][]>([]);

  readonly cells$ = this._cellSubject.asObservable();
  readonly cellSize$ = this._fieldService.width$.pipe(
    map((width) => {
      return Math.floor((this._widthPx - (width - 1) * this._gapPx) / width);
    }),
  );

  constructor() {
    combineLatest([this._fieldService.height$, this._fieldService.width$])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.newField());
  }

  newField() {
    this._cellSubject.next(
      Array.from(
        { length: this._fieldService.getHeight() },
        () => new Array(this._fieldService.getWidth()),
      ),
    );
  }
}
