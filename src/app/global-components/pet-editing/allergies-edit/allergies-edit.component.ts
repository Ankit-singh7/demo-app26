import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef } from '@angular/core';
import { AnimationController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { DataService } from '../../../services/data.service';
import { Pet } from '../../../classes/pet';
import { TrackingService } from '../../../services/tracking.service';
const { Keyboard } = Plugins;

@Component({
  selector: 'app-edit-allergies',
  templateUrl: './allergies-edit.component.html',
  styleUrls: ['./allergies-edit.component.scss'],
})
export class AllergiesEditComponent implements OnInit {

  @Output() hasAllergies = new EventEmitter();
  @Output() keyboardAnim = new EventEmitter();
  @Input() type: string;

  constructor(private trackingService: TrackingService, private platform: Platform, private animationController: AnimationController, private dataService: DataService, private cdr: ChangeDetectorRef) {
    if (Keyboard) {
      Keyboard.addListener('keyboardWillHide', () => {
        this.onKeyboardStateChange(false);
        this.keyboardAnim.emit(false);
      });
      Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardAnim.emit(true);
      });
    }
  }

  public allergiesData = [];
  public allergiesList = [];
  public allergy;
  public petAllergies = [];
  public searchBar;
  public pet;
  public radioSelected = "yes";
  private isKeyboardOpen = false;

  isItemAvailable = false;


  ngOnInit() {
    if(this.type === 'onboarding') {
      this.radioSelected = 'no';
      this.checkAllergies();
    }
    
    fetch('./assets/data/allergies.json').then(res => res.json()).then(json => {
      this.allergiesData = json
      this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
        this.pet = pet;
        if(this.petAllergies.length === 0){
          this.petAllergies = !pet.allergies ? [] : pet.allergies;
        }
        this.petAllergies.forEach(val => {
          this.syncData(val);
        })
      })
    });
  }

  filterList(evt) {
    this.allergy = evt.target.value;
    const searchTerm = evt.target.value;
    this.allergiesList = this.allergiesData;

    if (searchTerm && searchTerm.trim() !== '') {
      this.allergiesList = this.allergiesList.filter((item) => {
        return (item.toLowerCase().startsWith(searchTerm.toLowerCase()));
      });
      this.isItemAvailable = true;
    } else {
      this.isItemAvailable = false;
    }
    this.cdr.detectChanges();
  }

  allergyClicked(item) {
    if(this.petAllergies.length){
      if (this.petAllergies.some( ({val}) => val == item)) return false;
    }
    this.petAllergies.push(item);
    this.searchBar = '';
    this.isItemAvailable = false;

    this.syncData(item);

    this.checkAllergies();
  }

  syncData(item){
    const index = this.allergiesData.indexOf(item, 0);
    if (index > -1) {
      this.allergiesData.splice(index, 1);
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
    const index = this.petAllergies.indexOf(item);
    this.petAllergies.splice(index, 1);
    this.checkAllergies();
    this.allergiesData.push(item);
  }

  checkAllergies() {
    if (this.petAllergies.length > 0 && this.radioSelected === 'yes') {
      this.hasAllergies.emit({
        key: 'allergies',
        val: this.petAllergies
      } );
    } else if (this.radioSelected === 'no') {
      this.hasAllergies.emit({
        key: 'allergies',
        val: null
      })
    } else {
      this.hasAllergies.emit({
        key: 'allergies',
        val: []
      });
    }
  }

  toggleRadio(e) {
    this.radioSelected = e.detail.value;
    this.checkAllergies();
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
