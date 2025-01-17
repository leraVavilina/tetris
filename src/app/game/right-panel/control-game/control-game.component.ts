import { Component, inject } from '@angular/core';
import { TuiButton, TuiDialogService, TuiHint, TuiIcon } from '@taiga-ui/core';
import { SettingComponent } from './setting/setting.component';
import { FieldService } from '../../helpers/field.service';
import { Size } from '../../model/field.model';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { PlayService } from '../../helpers/play.service';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-control-game',
  standalone: true,
  imports: [TuiButton, TuiIcon, TuiHint, AsyncPipe],
  templateUrl: './control-game.component.html',
  styleUrl: './control-game.component.scss',
})
export class ControlGameComponent {
  private readonly _fieldService = inject(FieldService);
  private readonly _playService = inject(PlayService);
  private readonly _tuiDialog = inject(TuiDialogService);
  readonly isPlay$ = this._playService.isPlay$;
  readonly width$ = this._fieldService.width$;
  readonly height$ = this._fieldService.height$;

  constructor() {
    // this.showDialog();
  }

  pause() {
    this._playService.isPlay(false);
  }

  play() {
    this._playService.isPlay(true);
  }

  showDialog() {
    this._tuiDialog
      .open<Partial<Size>>(new PolymorpheusComponent(SettingComponent), {
        dismissible: true,
        closeable: false,
        size: 's',
      })
      .pipe(take(1))
      .subscribe(({ width, height }) => {
        width && this._fieldService.setWidth(width);
        height && this._fieldService.setHeight(height);
      });
  }
}
