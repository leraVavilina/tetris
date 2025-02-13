import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { PlayService } from './helpers/play.service';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { WIDTH_FIELD_PX, GAP_PX } from './injection-tokens';
import { FieldService } from './helpers/field.service';
import { TranslateFigureDirective } from './helpers/action/translate-figure.directive';
import { Coordinates } from './model/cell.model';
import { FigureService } from './helpers/figure.service';
import { AsyncPipe } from '@angular/common';
import { MouseControlDirective } from './helpers/action/mouse-control.directive';
import { combineLatest, filter, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { StartGameComponent } from './start-game/start-game.component';
import { RestartGameComponent } from './restart-game/restart-game.component';
import { FigureCanvasComponent } from './components/canvas/figure/figure-canvas.component';
import { FieldCanvasComponent } from './components/canvas/field/field-canvas.component';
import { HoverPositionDirective } from './helpers/action/hover-position.directive';
import { getSizeFromStorage } from './helpers/get-size-from-storage';
import { FigureView } from './model/figure.consts';
import { KeyboardControlDirective } from './helpers/action/keyboard-control.directive';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    RightPanelComponent,
    FigureCanvasComponent,
    StartGameComponent,
    RestartGameComponent,
    FieldCanvasComponent,

    TranslateFigureDirective,
    MouseControlDirective,
    HoverPositionDirective,
    KeyboardControlDirective,

    AsyncPipe,
  ],
  providers: [
    PlayService,
    FieldService,
    FigureService,
    {
      provide: WIDTH_FIELD_PX,
      useValue: 380,
    },
    {
      provide: GAP_PX,
      useValue: 3,
    },
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private readonly _figureService = inject(FigureService);
  private readonly _playService = inject(PlayService);
  private readonly _fieldService = inject(FieldService);
  readonly figure$ = this._figureService.figureView$;
  readonly color$ = this._figureService.figure$.pipe(
    filter((figure) => figure !== undefined),
    map(({ color }) => color),
  );
  readonly isPlay = toSignal(this._playService.isPlay$);
  readonly fieldPosition = signal<Coordinates>(
    this._figureService.getDefaultPosition(),
  );
  readonly isGameOver$ = this._playService.isGameOver$;
  readonly position$ = this._figureService.position$;
  readonly lowestPosition$ = combineLatest([this.figure$, this.position$]).pipe(
    filter(([view]) => view !== undefined),
    map(([view, position]) =>
      this._fieldService.lowestPosition(view!, position),
    ),
  );

  constructor() {
    const { width, height } = getSizeFromStorage();
    this._fieldService.setHeight(height);
    this._fieldService.setWidth(width);

    combineLatest([this._fieldService.height$, this._fieldService.width$])
      .pipe(takeUntilDestroyed())
      .subscribe(([height, width]) => {
        localStorage.setItem('width', width.toString());
        localStorage.setItem('height', height.toString());
      });
  }

  setPosition(position: Coordinates) {
    if (this.isPlay()) {
      this.fieldPosition.set(position);
      this._figureService.horizontalMove(position.x);
    }
  }

  isOverlay(
    positionUp: Coordinates,
    positionDown: Coordinates,
    view: FigureView,
  ): boolean {
    if (positionUp.y < positionDown.y + view.length) {
      return true;
    }
    return false;
  }
}
