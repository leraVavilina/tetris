import { Component, inject, signal } from '@angular/core';
import { FieldComponent } from './components/field/field.component';
import { GameService } from './helpers/game.service';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { WIDTH_FIELD_PX, GAP_PX } from './injection-tokens';
import { FigureComponent } from './components/figure/figure.component';
import { FieldService } from './helpers/field.service';
import { TranslateFigureDirective } from './helpers/action/translate-figure.component';
import { Coordinates } from './model/cell.model';
import { DEFAULT_POSITION } from './model/figure.consts';
import { FigureService } from './helpers/figure.service';
import { AsyncPipe } from '@angular/common';
import { ActionFigureDirective } from './helpers/action/action-figure.component';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    FieldComponent,
    RightPanelComponent,
    FigureComponent,
    TranslateFigureDirective,
    AsyncPipe,
    ActionFigureDirective,
  ],
  providers: [
    GameService,
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
  readonly figure$ = this._figureService.figureView$;
  readonly color$ = this._figureService.figure$.pipe(
    filter((figure) => figure !== undefined),
    map(({ color }) => color),
  );
  readonly fieldPosition = signal<Coordinates>(DEFAULT_POSITION);

  setPosition(position: Coordinates) {
    this.fieldPosition.set(position);
    this._figureService.setPosition(position);
  }
}
