import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { PlayService } from '../helpers/play.service';

@Component({
  selector: 'app-restart-game',
  imports: [TuiCardLarge, TuiTitle, TuiButton, TuiAppearance],
  templateUrl: './restart-game.component.html',
  styleUrl: './restart-game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestartGameComponent {
  private readonly _playService = inject(PlayService);

  play() {
    this._playService.setIsPlay(true);
  }

  newGame() {
    this._playService.newGame();
  }
}
