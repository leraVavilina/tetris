import { Component, computed, inject, input, signal } from '@angular/core';
import { FigureType } from '../../model/tetris-component.model';
import { Color } from '../../model/color.model';
import { Coordinates } from '../../model/cell.model';
import { CellComponent } from '../cell/cell.component';
import { GAP_PX } from '../../injection-tokens';
import { FIGURE_VIEW } from '../../model/figure.consts';

@Component({
  selector: 'app-figure',
  imports: [CellComponent],
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss',
  standalone: true,
})
export class FigureComponent {
  readonly gap = inject(GAP_PX);

  readonly figure = input.required<FigureType>();
  readonly color = input<Color>('red');
  readonly position = signal<Coordinates>({ x: 10, y: 2 }); //не учитывается

  readonly figureView = computed(() => FIGURE_VIEW[this.figure()]);
}
