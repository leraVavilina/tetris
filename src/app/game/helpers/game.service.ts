import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { FigureService } from './figure.service';

@Injectable()
export class GameService implements OnDestroy {
  private readonly _figureService = inject(FigureService);
  private readonly _isPlaySubject = new BehaviorSubject<boolean>(true);
  private readonly _onDestroy = new Subject<void>();

  readonly isPlay$ = this._isPlaySubject.asObservable();

  constructor() {
    this.isPlay$
      .pipe(
        takeUntil(this._onDestroy),
        switchMap((isPlay) => {
          if (isPlay) {
            return interval(800).pipe(takeUntil(this._onDestroy));
          }
          return of();
        }),
      )
      .subscribe((v) => {
        this._figureService.downFigure();
      });
  }

  pause() {
    this._isPlaySubject.next(false);
  }

  play() {
    this._isPlaySubject.next(true);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
  }
}
