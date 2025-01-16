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
import { Speed, SPEED_MAP } from '../model/game.model';

@Injectable()
export class PlayService implements OnDestroy {
  private readonly _figureService = inject(FigureService);
  private readonly _fieldService = inject(FieldService);
  private readonly _isPlaySubject = new BehaviorSubject<boolean>(false);
  private readonly _speedSubject = new BehaviorSubject<Speed>('default');
  private readonly _onDestroy = new Subject<void>();
  private readonly _isGameOverSubject = new BehaviorSubject<boolean>(false);

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
                interval(SPEED_MAP[speed]).pipe(takeUntil(this._onDestroy)),
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

    this.start();
  }

  setSpeed(speed: Speed) {
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
