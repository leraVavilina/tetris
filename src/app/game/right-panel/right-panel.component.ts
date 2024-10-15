import { Component } from '@angular/core';
import { ControlGameComponent } from './control-game/control-game.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { NextFigureComponent } from './next-figure/next-figure.component';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [ControlGameComponent, ScoreboardComponent, NextFigureComponent],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
})
export class RightPanelComponent {}
