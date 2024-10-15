import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable()
export class FieldService {
  readonly minWidth = 10;
  readonly maxWidth = 13;
  readonly minHeight = 8;
  readonly maxHeight = 18;

  private readonly _widthSubject = new BehaviorSubject<number>(7);
  private readonly _heightSubject = new BehaviorSubject<number>(8);

  readonly width$ = this._widthSubject.pipe(distinctUntilChanged());
  readonly height$ = this._heightSubject.pipe(distinctUntilChanged());

  setWidth(width: number) {
    this._widthSubject.next(width);
  }

  setHeight(height: number) {
    this._heightSubject.next(height);
  }

  getWidth(): number {
    return this._widthSubject.value;
  }

  getHeight(): number {
    return this._heightSubject.value;
  }
}
