import { Component, inject, signal } from '@angular/core';
import { FieldComponent } from './components/field/field.component';
import { PlayService } from './helpers/play.service';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { WIDTH_FIELD_PX, GAP_PX } from './injection-tokens';
import { FigureComponent } from './components/figure/figure.component';
import { FieldService } from './helpers/field.service';
import { TranslateFigureDirective } from './helpers/action/translate-figure.component';
import { Coordinates } from './model/cell.model';
import { FigureService } from './helpers/figure.service';
import { AsyncPipe } from '@angular/common';
import { ActionFigureDirective } from './helpers/action/action-figure.component';
import { combineLatest, filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StartGameComponent } from './start-game/start-game.component';
import { RestartGameComponent } from './restart-game/restart-game.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    FieldComponent,
    RightPanelComponent,
    FigureComponent,
    StartGameComponent,
    RestartGameComponent,

    TranslateFigureDirective,
    ActionFigureDirective,

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

  setPosition(position: Coordinates) {
    if (this.isPlay()) {
      this.fieldPosition.set(position);
      this._figureService.horizontalMove(position.x);
    }
  }
}
