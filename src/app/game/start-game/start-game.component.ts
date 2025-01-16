import { Component, inject } from '@angular/core';
import {
  TuiAppearance,
  TuiButton,
  TuiDialogService,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { PlayService } from '../helpers/play.service';
import { Size } from '../model/field.model';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { SettingComponent } from '../right-panel/control-game/setting/setting.component';
import { FieldService } from '../helpers/field.service';

@Component({
  selector: 'app-start-game',
  imports: [TuiCardLarge, TuiHeader, TuiTitle, TuiAppearance, TuiButton],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss',
})
export class StartGameComponent {
  private readonly _playService = inject(PlayService);
  private readonly _tuiDialog = inject(TuiDialogService);
  private readonly _fieldService = inject(FieldService);

  constructor() {}

  startGame() {
    this._playService.start();
  }

  openSetting() {
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
