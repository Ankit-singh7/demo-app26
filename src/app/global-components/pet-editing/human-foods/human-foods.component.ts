import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-human-foods',
  templateUrl: './human-foods.component.html',
  styleUrls: ['./human-foods.component.scss'],
})
export class HumanFoodsComponent implements OnInit {

  @Output() submitData = new EventEmitter();

  public pet;
  constructor(private dataService: DataService) {
    this.dataService.currentPet$.subscribe(pet => { // subscribe for when current pet changes
      this.pet = pet;
    });
  }

  ngOnInit() {}

  submit(key = null, val = null) {
    this.submitData.emit({
      key: key,
      val: val
    });
  }

}
