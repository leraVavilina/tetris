import { Component } from '@angular/core';
import { FieldComponent } from './components/field/field.component';
import { GameService } from './helpers/game.service';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { WIDTH_FIELD_PX, GAP_PX } from './injection-tokens';
import { CellService } from './helpers/cell.service';
import { FigureComponent } from './components/figure/figure.component';
import { FieldService } from './helpers/field.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FieldComponent, RightPanelComponent, FigureComponent],
  providers: [
    GameService,
    CellService,
    FieldService,
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
export class GameComponent {}
