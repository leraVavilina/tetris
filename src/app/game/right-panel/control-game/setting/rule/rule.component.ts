import { Component } from '@angular/core';
import { TuiStepper } from '@taiga-ui/kit';

@Component({
  selector: 'app-rule',
  imports: [TuiStepper],
  templateUrl: './rule.component.html',
  styleUrl: './rule.component.scss',
})
export class RuleComponent {
  activeItem = 0;
}
