import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  interval,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { FigureService } from './figure.service';
import { FieldService } from './field.service';
import { FIGURE_VIEW } from '../model/figure.consts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class PlayService implements OnDestroy {
  private readonly _figureService = inject(FigureService);
  private readonly _fieldService = inject(FieldService);

  private _defaultSpeed = 1000;
  private _speedCoef = 0.01;
  private _scoreForSpeed = 13;
  private _minSpeed = 300;

  private readonly _isPlaySubject = new BehaviorSubject<boolean>(true);
  private readonly _speedSubject = new BehaviorSubject<number>(
    this._defaultSpeed,
  );
  private readonly _onDestroy = new Subject<void>();
  private readonly _isGameOverSubject = new BehaviorSubject<boolean>(true);

  readonly speed$ = this._speedSubject.asObservable();
  readonly isPlay$ = this._isPlaySubject.asObservable();
  readonly isGameOver$ = this._isGameOverSubject.asObservable();

  constructor() {
    this.isPlay$
      .pipe(
        takeUntil(this._onDestroy),
        switchMap((isPlay) => {
          if (isPlay) {
            return this._speedSubject.pipe(
              switchMap((speed) =>
                interval(speed).pipe(
                  filter(() => !this._isGameOverSubject.value),
                  takeUntil(this._onDestroy),
                ),
              ),
            );
          }
          return of();
        }),
      )
      .subscribe(() => {
        this._figureService.downFigure();
      });

    this._figureService.figure$
      .pipe(
        takeUntil(this._onDestroy),
        filter((figure) => !!figure),
        map((figure) => {
          return !this._fieldService.canMove(
            FIGURE_VIEW[figure.type],
            this._figureService.getDefaultPosition(),
          );
        }),
      )
      .subscribe((isOver) => {
        if (isOver) {
          this._isPlaySubject.next(false);
          this._isGameOverSubject.next(true);
        }
      });

    this._fieldService.score$.pipe(takeUntilDestroyed()).subscribe((score) => {
      const delta = score / this._scoreForSpeed;
      const newSpeed = Math.max(
        this._defaultSpeed - this._defaultSpeed * (delta * this._speedCoef),
        this._minSpeed,
      );
      if (delta > 1) {
        this._speedSubject.next(newSpeed);
      }
    });
  }

  speedUp(coef: number) {
    let speed = this._speedSubject.value;
    speed = speed / coef;
    this._speedSubject.next(speed);
  }

  speedDown(coef: number) {
    let speed = this._speedSubject.value;
    speed = speed * coef;
    this._speedSubject.next(speed);
  }

  isPlay(isPlay: boolean) {
    this._isPlaySubject.next(isPlay);
  }

  start() {
    this._isPlaySubject.next(true);
    this._isGameOverSubject.next(false);
    this._fieldService.newField();
    this._figureService.newGame();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
  }
}
