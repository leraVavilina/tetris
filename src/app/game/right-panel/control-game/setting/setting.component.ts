import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TuiTabs } from '@taiga-ui/kit';
import { FieldSizeComponent } from './field-size/field-size.component';
import { RuleComponent } from './rule/rule.component';
import { TetrisFallComponent } from '../../../../ui/tetris-fall/tetris-fall.component';
import { HotkeyComponent } from './hotkey/hotkey.component';

@Component({
  selector: 'app-setting',
  imports: [
    TuiTabs,
    FieldSizeComponent,
    RuleComponent,
    HotkeyComponent,
    TetrisFallComponent,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingComponent {
  readonly activeTab = signal<number>(0);
}
