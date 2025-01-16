import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { FigureComponent } from '../../game/components/figure/figure.component';
import { GAP_PX, WIDTH_FIELD_PX } from '../../game/injection-tokens';
import { FieldService } from '../../game/helpers/field.service';
import { generateFigure } from '../../game/helpers/generate-figure';

@Component({
  selector: 'app-tetris-fall',
  imports: [FigureComponent],
  providers: [
    FieldService,
    {
      provide: GAP_PX,
      useValue: 1,
    },
    {
      provide: WIDTH_FIELD_PX,
      useValue: 50,
    },
  ],
  templateUrl: './tetris-fall.component.html',
  styleUrl: './tetris-fall.component.scss',
})
export class TetrisFallComponent implements AfterViewInit {
  private readonly _elementRef: any = inject(ElementRef);
  readonly count = input<number>(20);
  readonly size = input<number>(10);
  readonly speed = input<number>(500);
  readonly randomFigure = computed(() => generateFigure(this.count()));
  readonly styles = computed(() => {
    const result: { top: number; left: number; speed: number }[] = [];
    for (let i = 0; i < this.count(); i++) {
      result.push({
        top: this._randomTop(),
        left: this._randomLeft(),
        speed: 10,
      });
    }
    return result;
  });

  readonly height = this._elementRef;

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this._fall();
    });
  }

  getTranslate(index: number) {
    return `translate(${this.styles()[index].left}px, ${this.styles()[index].top}px)`;
  }

  private _fall() {
    requestAnimationFrame(() => {
      this._fall();
    });

    this.styles().forEach((style) => {
      if (style.top > this._elementRef.nativeElement.clientHeight) {
        style.top = this._randomTop();
        style.left = this._randomLeft();
      } else {
        style.top += 1;
      }
    });
  }

  private _randomLeft(): number {
    return Math.floor(
      Math.random() * (this._elementRef.nativeElement.clientWidth || 1000),
    );
  }

  private _randomTop(): number {
    return Math.floor(
      Math.random() * -(this._elementRef.nativeElement.clientHeight || 1000) -
        10,
    );
  }
}
