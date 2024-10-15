import { Component, inject, signal } from '@angular/core';
import { TuiButton, TuiDialogService, TuiHint, TuiIcon } from '@taiga-ui/core';
import { SettingComponent } from './setting/setting.component';
import { FieldService } from '../../helpers/field.service';
import { Size } from '../../model/field.model';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-control-game',
  standalone: true,
  imports: [TuiButton, TuiIcon, TuiHint],
  templateUrl: './control-game.component.html',
  styleUrl: './control-game.component.scss',
})
export class ControlGameComponent {
  private readonly _fieldService = inject(FieldService);
  private readonly _tuiDialog = inject(TuiDialogService);
  readonly isPause = signal<boolean>(true);

  readonly width$ = this._fieldService.width$;
  readonly height$ = this._fieldService.height$;

  toggle() {
    this.isPause.update((isPause) => !isPause);
  }

  showDialog() {
    this._tuiDialog
      .open<Partial<Size>>(new PolymorpheusComponent(SettingComponent), {
        dismissible: true,
        closeable: false,
        size: 's',
      })
      .subscribe(({ width, height }) => {
        width && this._fieldService.setWidth(width);
        height && this._fieldService.setHeight(height);
      });
  }
}
