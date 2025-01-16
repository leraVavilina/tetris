import { Component, computed, inject, input } from '@angular/core';
import { Color, COLOR_MAP } from '../../model/color.model';
import { AsyncPipe } from '@angular/common';
import { FieldService } from '../../helpers/field.service';

type Visibility = 'hidden' | 'visible';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  readonly cellSize$ = inject(FieldService).cellSize$;

  readonly color = input<Color>('default');
  readonly colorValue = computed<string>(() => COLOR_MAP[this.color()]);
  readonly backgroundColor = computed<string>(() =>
    this.isDotted() ? COLOR_MAP.default : this.colorValue(),
  );
  readonly isVisible = input<Visibility, boolean>('visible', {
    transform: (isVisible) =>
      isVisible
        ? ('visible' satisfies Visibility)
        : ('hidden' satisfies Visibility),
  });
  readonly isDotted = input<boolean>(false);
}
