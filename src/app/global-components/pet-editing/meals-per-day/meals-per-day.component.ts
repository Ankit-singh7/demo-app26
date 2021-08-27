import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-meals-per-day',
  templateUrl: './meals-per-day.component.html',
  styleUrls: ['./meals-per-day.component.scss'],
})
export class MealsPerDayComponent implements OnInit {

  @Output() submitData = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  submit(key = null, val = null) {
    this.submitData.emit({
      key: key,
      val: val
    });
  }

}
