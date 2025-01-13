import { Component, inject, signal } from '@angular/core';
import { FieldComponent } from './components/field/field.component';
import { GameService } from './helpers/game.service';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { WIDTH_FIELD_PX, GAP_PX } from './injection-tokens';
import { CellService } from './helpers/cell.service';
import { FigureComponent } from './components/figure/figure.component';
import { FieldService } from './helpers/field.service';
import { TranslateFigureDirective } from './helpers/action/translate-figure.component';
import { Coordinates } from './model/cell.model';
import { FIGURE_VIEW } from './model/figure.consts';
import { FigureService } from './helpers/figure.service';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    FieldComponent,
    RightPanelComponent,
    FigureComponent,
    TranslateFigureDirective,
    AsyncPipe,
  ],
  providers: [
    GameService,
    CellService,
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

  setPosition(position: Coordinates) {
    this._figureService.setPosition(position);
  }
}
