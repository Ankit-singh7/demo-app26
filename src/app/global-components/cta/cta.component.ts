
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CtaComponent {
  @Input() type: string;
  @Input() text: string;
  @Input() disabled: boolean;
  @Input() highlight: boolean;
  @Input() registered: boolean;
  @Input() showIcon: boolean;
  @Input() isSubmit: boolean;
  constructor() {
  }
}