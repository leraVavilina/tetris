import { Component, effect, inject } from '@angular/core';
import { FieldService } from '../../../../helpers/field.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiSlider } from '@taiga-ui/kit';
import { FieldComponent } from '../../../../components/field/field.component';
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

@Component({
  selector: 'app-field-size',
  imports: [
    TuiSlider,
    ReactiveFormsModule,
    FieldComponent,
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
})
export class FieldSizeComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _fieldService = inject(FieldService);
  private readonly _context = injectContext<TuiDialogContext<Partial<Size>>>();

  readonly minWidth = MIN_WIDTH_FIELD;
  readonly maxWidth = MAX_WIDTH_FIELD;
  readonly minHeight = MIN_HEIGHT_FIELD;
  readonly maxHeight = MAX_HEIGHT_FIELD;

  readonly curWidth = 11; //должно быть в кеше
  readonly curHeight = 7; //должно быть в кеше

  readonly widthControl = this._fb.control<number>(this.curWidth);
  readonly heightControl = this._fb.control<number>(this.curHeight);

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

    effect(() => {
      this.widthControl.setValue(this.curWidth);
    });
    effect(() => {
      this.heightControl.setValue(this.curHeight);
    });
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
