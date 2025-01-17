import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { FieldService } from '../../../helpers/field.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Cell } from '../../../model/cell.model';
import { CellBasedDirective } from '../cell-based.directive';
import { COLOR_MAP } from '../../../model/color.model';

@Component({
  selector: 'app-field-canvas',
  standalone: true,
  imports: [],
  templateUrl: './field-canvas.component.html',
  styleUrl: './field-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldCanvasComponent
  extends CellBasedDirective<Cell>
  implements AfterViewInit
{
  private readonly _fieldService = inject(FieldService);
  private readonly _cells = toSignal(this._fieldService.cells$);

  protected override items: Signal<Cell[][]> = computed(() => this._cells()!);

  constructor() {
    super();

    this._fieldService.cells$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.clear();

      if (this.ctx) {
        this.draw();
      }
    });
  }

  protected override draw() {
    if (!this.ctx) {
      return;
    }
    const view = this.items();
    for (let y = 0; y < view.length; y++) {
      for (let x = 0; x < view[0].length; x++) {
        const color = COLOR_MAP[view[y][x].color];
        this.ctx.fillStyle = color;

        this.drawCell({ x, y });
      }
    }
  }
}
