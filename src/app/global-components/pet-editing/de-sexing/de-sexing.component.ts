import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-de-sexing',
  templateUrl: './de-sexing.component.html',
  styleUrls: ['./de-sexing.component.scss'],
})
export class DeSexingComponent implements OnInit {
  @Input() type: string;
  @Output() submitData = new EventEmitter();
  public pet;
  constructor(private dataService: DataService) {
    this.dataService.currentPet$.subscribe(pet => { // subscribe for when current pet changes
      this.pet = pet;
    });
  }

  ngOnInit() {

  }

  async submit(key = null, val = null) {
    if(key === 'neutered' || key === 'spayed') {
      await this.dataService.updatePetData('desexedUndecided', false);
    }
    this.submitData.emit({
      key: key,
      val: val
    });
  }
}
