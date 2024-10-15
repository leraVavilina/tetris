import { Component, computed, inject, input } from '@angular/core';
import { Color, COLOR_MAP } from '../../model/color.model';
import { CellService } from '../../helpers/cell.service';
import { AsyncPipe } from '@angular/common';

type Visibility = 'hidden' | 'visible';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  readonly cellSize$ = inject(CellService).cellSize$;

  readonly color = input<Color>('default');
  readonly colorValue = computed<string>(() => COLOR_MAP[this.color()]);
  readonly isVisible = input<Visibility, boolean>('visible', {
    transform: (isVisible) =>
      isVisible
        ? ('visible' satisfies Visibility)
        : ('hidden' satisfies Visibility),
  });
}
