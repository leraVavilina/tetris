import { Component, inject, Output } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { GAP_PX } from '../../injection-tokens';
import { Coordinates } from '../../model/cell.model';
import { AsyncPipe, NgFor } from '@angular/common';
import { distinctUntilChanged, Subject } from 'rxjs';
import { FieldService } from '../../helpers/field.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CellComponent, AsyncPipe, NgFor],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  animations: [
    trigger('clearCells', [
      transition(':leave', [
        animate('0.2s', style({ scale: '0 100%', translate: '-1000px' })),
      ]),
    ]),
  ],
})
export class FieldComponent {
  private readonly _fieldService = inject(FieldService);
  private readonly _hoverPosition = new Subject<Coordinates>();
  readonly gap = inject(GAP_PX);

  readonly cells$ = this._fieldService.cells$;

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
