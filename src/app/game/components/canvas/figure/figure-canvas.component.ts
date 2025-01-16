import {
  AfterViewInit,
  Component,
  computed,
  input,
  Signal,
} from '@angular/core';
import {
  FIGURE_VIEW,
  FigureType,
  FigureView,
  isFigureType,
} from '../../../model/figure.consts';
import { CellBasedDirective } from '../cell-based.directive';
import { Color, COLOR_MAP } from '../../../model/color.model';

@Component({
  selector: 'app-figure-canvas',
  templateUrl: './figure-canvas.component.html',
  styleUrl: './figure-canvas.component.scss',
  standalone: true,
})
export class FigureCanvasComponent
  extends CellBasedDirective<0 | 1>
  implements AfterViewInit
{
  readonly figure = input.required<FigureView, FigureView | FigureType>({
    transform: (figure) => {
      if (isFigureType(figure)) {
        return FIGURE_VIEW[figure];
      }
      return figure;
    },
  });
  protected override items: Signal<(0 | 1)[][]> = computed(() => this.figure());
  readonly isDotted = input<boolean>(false);
  readonly color = input.required<Color>();

  protected override draw() {
    if (!this.ctx) {
      return;
    }
    const view = this.items();
    const color = COLOR_MAP[this.color()];

    this.ctx.fillStyle = color;
    for (let y = 0; y < view.length; y++) {
      for (let x = 0; x < view[0].length; x++) {
        if (view[y][x]) {
          if (this.isDotted()) {
            this.ctx.globalAlpha = 0.4;
          }

          this.drawCell({ x, y });
        }
      }
    }
  }
}
