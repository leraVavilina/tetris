import { Component, inject } from '@angular/core';
import { FigureComponent } from '../../components/figure/figure.component';
import { GAP_PX, WIDTH_FIELD_PX } from '../../injection-tokens';
import { FieldService } from '../../helpers/field.service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FigureService } from '../../helpers/figure.service';

@Component({
  selector: 'app-next-figure',
  standalone: true,
  imports: [FigureComponent, AsyncPipe],
  providers: [
    FieldService,
    {
      provide: WIDTH_FIELD_PX,
      useValue: 60,
    },
    {
      provide: GAP_PX,
      useValue: 0,
    },
  ],
  templateUrl: './next-figure.component.html',
  styleUrl: './next-figure.component.scss',
})
export class NextFigureComponent {
  private readonly _gapPx = inject(GAP_PX);
  private readonly _fieldService = inject(FieldService);
  private readonly _figureService = inject(FigureService);
  readonly width = inject(WIDTH_FIELD_PX);

  readonly current$ = this._figureService.figure$;
  readonly next$ = this._figureService.nextFigure$;

  readonly height = combineLatest([
    this._fieldService.height$,
    this._fieldService.cellSize$,
  ]).pipe(
    map(([cellSize, height]) => {
      return cellSize * height + this._gapPx * (height - 1);
    }),
  );

  constructor() {
    this._fieldService.setHeight(4);
    this._fieldService.setWidth(3);
  }
}
