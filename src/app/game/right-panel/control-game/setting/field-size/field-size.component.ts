import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FieldService } from '../../../../helpers/field.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiSlider } from '@taiga-ui/kit';
import { GAP_PX, WIDTH_FIELD_PX } from '../../../../injection-tokens';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiButton, TuiDialogContext, TuiNotification } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import {
  MAX_HEIGHT_FIELD,
  MAX_WIDTH_FIELD,
  MIN_HEIGHT_FIELD,
  MIN_WIDTH_FIELD,
  Size,
} from '../../../../model/field.model';
import { FieldCanvasComponent } from '../../../../components/canvas/field/field-canvas.component';
import { getSizeFromStorage } from '../../../../helpers/get-size-from-storage';

@Component({
  selector: 'app-field-size',
  imports: [
    TuiSlider,
    ReactiveFormsModule,
    FieldCanvasComponent,
    TuiButton,
    TuiNotification,
  ],
  providers: [
    FieldService,
    {
      provide: WIDTH_FIELD_PX,
      useValue: 200,
    },
    {
      provide: GAP_PX,
      useValue: 1,
    },
  ],
  templateUrl: './field-size.component.html',
  styleUrl: './field-size.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldSizeComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _fieldService = inject(FieldService);
  private readonly _context = injectContext<TuiDialogContext<Partial<Size>>>();

  readonly minWidth = MIN_WIDTH_FIELD;
  readonly maxWidth = MAX_WIDTH_FIELD;
  readonly minHeight = MIN_HEIGHT_FIELD;
  readonly maxHeight = MAX_HEIGHT_FIELD;

  readonly widthControl = this._fb.control<number>(MIN_WIDTH_FIELD);
  readonly heightControl = this._fb.control<number>(MIN_HEIGHT_FIELD);

  readonly widthLabels: number[] = new Array(this.maxWidth - this.minWidth + 1)
    .fill(0)
    .map((_, index) => index + this.minWidth);

  readonly heightLabels: number[] = new Array(
    this.maxHeight - this.minHeight + 1,
  )
    .fill(0)
    .map((_, index) => index + this.minHeight);

  constructor() {
    this.widthControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((width) => width && this._fieldService.setWidth(width));
    this.heightControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((height) => height && this._fieldService.setHeight(height));

    const { width, height } = getSizeFromStorage();
    this.widthControl.setValue(width);
    this.heightControl.setValue(height);
  }

  submit() {
    this._context.completeWith({
      width: this.widthControl.value ?? undefined,
      height: this.heightControl.value ?? undefined,
    });
  }

  setWidth(width: number) {
    this.widthControl.setValue(width);
  }

  setHeight(height: number) {
    this.heightControl.setValue(height);
  }
}
