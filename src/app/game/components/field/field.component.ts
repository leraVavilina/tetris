import { Component, inject, input, signal } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { GAP_PX } from '../../injection-tokens';
import { CellService } from '../../helpers/cell.service';
import { Color } from '../../model/color.model';
import { Coordinates } from '../../model/cell.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CellComponent, AsyncPipe],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
})
export class FieldComponent {
  private readonly _cellService = inject(CellService);
  readonly gap = inject(GAP_PX);

  readonly color = input<Color>('red');
  readonly position = signal<Coordinates>({ x: 0, y: 0 });

  readonly cells$ = this._cellService.cells$;
}
