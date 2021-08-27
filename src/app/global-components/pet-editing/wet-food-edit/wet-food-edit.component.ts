import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AnimationController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { DataService } from 'src/app/services/data.service';
import { Pet } from '../../../classes/pet';
const {Keyboard} = Plugins;

@Component({
  selector: 'app-edit-wet-food',
  templateUrl: './wet-food-edit.component.html',
  styleUrls: ['./wet-food-edit.component.scss'],
})
export class WetFoodEditComponent implements OnInit {
  @Input() type: string;
  @Output() hasWetFoods = new EventEmitter();
  @Output() keyboardAnim = new EventEmitter();

  public searchBar;
  public pet;
  @ViewChild('foodSearch', { static: false }) foodSearch: any;

  constructor(private platform: Platform, private animationController: AnimationController, private dataService: DataService) {
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

  public wetFoodsData = [];
  public wetFoodsList = [];
  public wetFood;
  public petWetFoods = [];

  private isKeyboardOpen = false;

  isItemAvailable = false;


  ngOnInit() {
    fetch('./assets/data/wet-food.json').then(res => res.json()).then(json => {
      this.wetFoodsData = json;
      this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
        this.pet = pet;
        this.petWetFoods = pet.wetFoods;
        this.petWetFoods.forEach(val => {
          this.syncData(val);
        })
      })
    });
  }

  filterList(evt) {
    const trimmedFood = evt.target.value.slice(0,55)
    this.foodSearch.value = trimmedFood
    this.wetFood = trimmedFood;
    const searchTerm = trimmedFood;
    this.wetFoodsList = this.wetFoodsData;

    if (searchTerm && searchTerm.trim() !== '') {
      this.wetFoodsList = this.wetFoodsList.filter((item) => {
        return (item.toLowerCase().includes(searchTerm.toLowerCase()));
      });
      this.isItemAvailable = true;
    } else {
      this.isItemAvailable = false;
    }
  }

  wetFoodCustom(item: string) {
    if (item.length === 0) return
    const titleCaseItem = item.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    this.wetFoodClicked(titleCaseItem)
  }

  wetFoodClicked(item: string) {
    if (item.length === 0) return
    if(this.petWetFoods.length){
      if (this.petWetFoods.some( ({val}) => val == item)) return false;
    }
    this.petWetFoods.push(item);
    this.searchBar = '';
    this.isItemAvailable = false;

    this.syncData(item);

    this.checkWetFoods();
  }

  syncData(item){
    const index = this.wetFoodsData.indexOf(item, 0);
    if (index > -1) {
      this.wetFoodsData.splice(index, 1);
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

  removeItem(item) {
    const index = this.petWetFoods.indexOf(item);
    this.petWetFoods.splice(index, 1);
    this.checkWetFoods();
    this.wetFoodsData.push(item);
  }

  checkWetFoods() {
    if (this.petWetFoods.length > 0) {
      this.hasWetFoods.emit({
        key: 'wetFoods',
        val: this.petWetFoods
      });
    } else {
      this.hasWetFoods.emit({
        key: 'wetFoods',
        val: []
      });
    }
  }

  closeKeyboard(event) {
    if (event.key === 'Enter') {
      if (Keyboard) {
        Keyboard.hide();
      }
    }
  }
}
