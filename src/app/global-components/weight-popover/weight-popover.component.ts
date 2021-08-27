import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-weight-popover',
  templateUrl: './weight-popover.component.html',
  styleUrls: ['./weight-popover.component.scss'],
})
export class WeightPopoverComponent implements OnInit {

  public pet;
  public activeMeasurement;

  constructor(private dataService: DataService, private popover: PopoverController) {
    this.dataService.currentPet$.subscribe(pet => { // subscribe for when current pet changes
      this.pet = pet;
      this.activeMeasurement = this.pet.weightType;
    });
  }

  ngOnInit() {
  }

  changeWeight(weight) {
    if (weight === this.pet.weightType) return;
    this.dataService.updatePetData('weightType', weight).then(() => {
      if (weight === 'lb') {
        this.pet.weight = this.pet.weight * 2.2046;
      } else {
        this.pet.weight = this.pet.weight / 2.2046;
      }
      this.dataService.updatePetData('weight', this.pet.weight.toFixed(2));
      this.close();
    });
  }

  close() {
    this.popover.dismiss();
  }

}
