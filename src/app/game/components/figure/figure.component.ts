import { Component, inject, input } from '@angular/core';
import { Color } from '../../model/color.model';
import { CellComponent } from '../cell/cell.component';
import { GAP_PX } from '../../injection-tokens';
import {
  FIGURE_VIEW,
  FigureType,
  FigureView,
  isFigureType,
} from '../../model/figure.consts';

@Component({
  selector: 'app-figure',
  imports: [CellComponent],
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss',
  standalone: true,
})
export class FigureComponent {
  readonly gap = inject(GAP_PX);

  readonly figure = input.required<FigureView, FigureView | FigureType>({
    transform: (figure) => {
      if (isFigureType(figure)) {
        return FIGURE_VIEW[figure];
      }
      return figure;
    },
  });
  readonly color = input.required<Color>();
}
