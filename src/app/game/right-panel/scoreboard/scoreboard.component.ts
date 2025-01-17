import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FieldService } from '../../helpers/field.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { TuiBadge } from '@taiga-ui/kit';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [AsyncPipe, TuiBadge, NgClass],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardComponent {
  readonly score$ = inject(FieldService).score$;

  isSmall(score: number): boolean {
    return score < 100;
  }

  isMiddle(score: number): boolean {
    return score >= 100;
  }

  isBig(score: number): boolean {
    return score > 1000;
  }
}
