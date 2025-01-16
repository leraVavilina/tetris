import {
  AfterViewInit,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Signal,
  ViewChild,
} from '@angular/core';
import { Coordinates } from '../../model/cell.model';
import { FieldService } from '../../helpers/field.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GAP_PX } from '../../injection-tokens';

@Directive()
export abstract class CellBasedDirective<T> implements AfterViewInit {
  private readonly _gapPx = inject(GAP_PX);

  @ViewChild('canvas', { static: true })
  protected canvasRef!: ElementRef<HTMLCanvasElement>;
  protected ctx!: CanvasRenderingContext2D;

  protected abstract items: Signal<T[][]>;

  private readonly _size = computed(() => {
    const cells = this.items();
    const cellSize = this.cellSize();
    if (!cells || !cellSize) {
      return 0;
    }
    const height = cellSize * cells.length + this._gapPx * (cells.length - 1);
    const width =
      cellSize * cells[0].length + this._gapPx * (cells[0].length - 1);
    return {
      height,
      width,
    };
  });

  protected readonly fieldService = inject(FieldService);
  protected readonly cellSize = toSignal(this.fieldService.cellSize$);

  constructor() {
    effect(() => {
      const size = this._size();
      if (size) {
        this.canvasRef.nativeElement.height = size.height;
        this.canvasRef.nativeElement.width = size.width;
      }

      if (this.ctx) {
        this.draw();
      }
    });
  }

  ngAfterViewInit(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (ctx === null) {
      throw new Error('Can not create rendering context for canvas');
    }
    this.ctx = ctx;
    this.draw();
  }

  protected abstract draw(): void;

  protected drawCell(position: Coordinates) {
    const x = this.fieldService.positionToPixel(position.x);
    const y = this.fieldService.positionToPixel(position.y);
    const cellSize = this.cellSize();
    if (!cellSize) {
      throw new Error('cell is undefined');
    }

    this.ctx.fillRect(x, y, cellSize, cellSize);
  }

  protected clear() {
    if (this.ctx) {
      this.ctx.clearRect(
        0,
        0,
        this.canvasRef.nativeElement.width,
        this.canvasRef.nativeElement.height,
      );
    }
  }
}
