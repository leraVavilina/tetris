import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TuiButton, TuiIcon, TuiScrollbar } from '@taiga-ui/core';
import { TuiAccordion } from '@taiga-ui/experimental';

@Component({
  selector: 'app-hotkey',
  imports: [TuiAccordion, TuiScrollbar, TuiIcon, TuiButton],
  templateUrl: './hotkey.component.html',
  styleUrl: './hotkey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeyComponent {
  readonly isKeyboardActive = signal<boolean>(true);
}
