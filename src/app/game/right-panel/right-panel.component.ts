import { Component } from '@angular/core';
import { ControlGameComponent } from './control-game/control-game.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { NextFigureComponent } from './next-figure/next-figure.component';
import { TuiAppearance, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [
    ControlGameComponent,
    ScoreboardComponent,
    NextFigureComponent,
    TuiAppearance,
    TuiCardLarge,
    TuiTitle,
  ],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
})
export class RightPanelComponent {}
