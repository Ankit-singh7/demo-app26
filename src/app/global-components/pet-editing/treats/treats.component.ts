import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-treats',
  templateUrl: './treats.component.html',
  styleUrls: ['./treats.component.scss'],
})
export class TreatsComponent implements OnInit {

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
