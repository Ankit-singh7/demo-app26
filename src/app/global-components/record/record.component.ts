import { Component, Input } from '@angular/core';
import { PoopSample } from 'src/app/interfaces/poopSample';
import { Globalization } from '@ionic-enterprise/globalization/ngx';
import { TimezonePipe } from 'src/app/pipes/timezone.pipe';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
  providers: [Globalization]
})
export class RecordComponent {
  @Input() results: any;
   @Input() type: string;
   @Input() toggleDetails: boolean;
   @Input() viewType: string = "daily";
  constructor() {}

  public convertScoreToPercentage(score: number): number {
    return (((score-1) / 4) * 100) // change score (1-5) to percentage
  }
}
