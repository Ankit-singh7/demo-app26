import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef } from '@angular/core';
import { AnimationController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Pet } from '../../../classes/pet';
import { DataService } from '../../../services/data.service';
import { TrackingService } from '../../../services/tracking.service';
const { Keyboard } = Plugins;

@Component({
  selector: 'app-edit-conditions',
  templateUrl: './conditions-edit.component.html',
  styleUrls: ['./conditions-edit.component.scss'],
})
export class ConditionsEditComponent implements OnInit {

  @Output() hasConditions = new EventEmitter();
  @Output() keyboardAnim = new EventEmitter();
  @Input() type: string;

  constructor(private trackingService: TrackingService, private platform: Platform, private animationController: AnimationController, private dataService: DataService, private cdr: ChangeDetectorRef) {
    if (Keyboard) {
      Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardAnim.emit(false);
        this.onKeyboardStateChange(false);
      });
      Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardAnim.emit(true);
      });
    }
  }

  public conditionsData = [];
  public conditionsList = [];
  public condition;
  public petConditions = [];
  public searchBar;
  public pet;
  public radioSelected = "yes";
  private isKeyboardOpen = false;

  isItemAvailable = false;


  ngOnInit() {
    if(this.type === 'onboarding') {
      this.radioSelected = 'no';
      this.checkConditions();
    }

    fetch('./assets/data/conditions.json').then(res => res.json()).then(json => {
      this.conditionsData = json;
      this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
        this.pet = pet;
        if(this.petConditions.length === 0){
          this.petConditions = !pet.conditions ? [] : pet.conditions;
        }
        this.petConditions.forEach(val => {
          this.syncData(val);
        })
      })
    });
  }

  filterList(evt) {
    this.condition = evt.target.value;
    const searchTerm = evt.target.value;
    this.conditionsList = this.conditionsData;

    if (searchTerm && searchTerm.trim() !== '') {
      this.conditionsList = this.conditionsList.filter((item) => {
        return (item.toLowerCase().startsWith(searchTerm.toLowerCase()));
      });
      this.isItemAvailable = true;
    } else {
      this.isItemAvailable = false;
    }
    this.cdr.detectChanges();
  }

  conditionClicked(item) {
    if(this.petConditions.length){
      if (this.petConditions.some( ({val}) => val == item)) return false;
    }
    this.petConditions.push(item);
    this.searchBar = '';
    this.isItemAvailable = false;

    this.syncData(item);

    this.checkConditions();
  }

  syncData(item){
    const index = this.conditionsData.indexOf(item, 0);
    if (index > -1) {
      this.conditionsData.splice(index, 1);
    }
  }

  onKeyboardStateChange(event) {
    if (this.platform.is('cordova')) {
      if (event) {
        this.isKeyboardOpen = true;
        const anim = this.animationController.create()
          .addElement(document.querySelector('.content-to-shift'))
          .duration(200)
          .iterations(1)
          .fromTo('transform', 'translateY(0px)', 'translateY(-100px)');
        anim.play();
      } else {
        this.isKeyboardOpen = false;
        const anim = this.animationController.create()
          .addElement(document.querySelector('.content-to-shift'))
          .duration(200)
          .iterations(1)
          .fromTo('transform', 'translateY(-100px)', 'translateY(0px)');
        anim.play();
      }
    }
  }

  removeItem(item){
    const index = this.petConditions.indexOf(item);
    this.petConditions.splice(index, 1);
    this.checkConditions();
    this.conditionsData.push(item);
  }

  checkConditions() {
    if (this.petConditions.length > 0  && this.radioSelected === 'yes') {
      this.hasConditions.emit({
        key: 'conditions',
        val: this.petConditions
      } );
    }  else if (this.radioSelected === 'no') {
      this.hasConditions.emit({
        key: 'conditions',
        val: null
      });
    } else {
      this.hasConditions.emit({
        key: 'conditions',
        val: []
      });
    }
  }
  
  toggleRadio(e) {
    this.radioSelected = e.detail.value;
    this.checkConditions();
    this.cdr.detectChanges();
  }

  closeKeyboard(event) {
    if (event.key === 'Enter') {
      if (Keyboard) {
        Keyboard.hide();
      }
    }
  }
}
