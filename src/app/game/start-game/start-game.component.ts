import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  TuiAppearance,
  TuiButton,
  TuiDialogService,
  TuiNotification,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { PlayService } from '../helpers/play.service';
import { Size } from '../model/field.model';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { SettingComponent } from '../right-panel/control-game/setting/setting.component';
import { FieldService } from '../helpers/field.service';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-start-game',
  imports: [
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    TuiAppearance,
    TuiButton,
    TuiNotification,
    AsyncPipe,
  ],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartGameComponent {
  private readonly _playService = inject(PlayService);
  private readonly _tuiDialog = inject(TuiDialogService);
  private readonly _fieldService = inject(FieldService);

  readonly score$ = this._fieldService.score$;

  startGame() {
    this._playService.newGame();
  }

  openSetting() {
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
        this._playService.newGame();
      });
  }
}
