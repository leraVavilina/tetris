import { Component, inject, input, Output } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { GAP_PX } from '../../injection-tokens';
import { CellService } from '../../helpers/cell.service';
import { Color } from '../../model/color.model';
import { Coordinates } from '../../model/cell.model';
import { AsyncPipe } from '@angular/common';
import { distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CellComponent, AsyncPipe],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
})
export class FieldComponent {
  private readonly _cellService = inject(CellService);
  private readonly _hoverPosition = new Subject<Coordinates>();
  readonly gap = inject(GAP_PX);

  readonly color = input<Color>('red');
  readonly cells$ = this._cellService.cells$;

  @Output()
  readonly hoverPosition = this._hoverPosition.pipe(
    distinctUntilChanged(
      (prevPos, curPos) => prevPos.x === curPos.x && prevPos.y === curPos.y,
    ),
  );

  setPosition(x: number, y: number) {
    this._hoverPosition.next({ x, y });
  }
}
