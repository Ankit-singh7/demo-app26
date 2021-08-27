import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AnimationController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { DataService } from 'src/app/services/data.service';
import { Pet } from '../../../classes/pet';
const { Keyboard } = Plugins;

@Component({
  selector: 'app-edit-dry-food',
  templateUrl: './dry-food-edit.component.html',
  styleUrls: ['./dry-food-edit.component.scss'],
})
export class DryFoodEditComponent implements OnInit {
  @Input() type: string;
  @Output() hasDryFoods = new EventEmitter();
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

  public dryFoodsData = [];
  public dryFoodsList = [];
  public dryFood;
  public petDryFoods = [];

  private isKeyboardOpen = false;

  isItemAvailable = false;


  ngOnInit() {
    fetch('./assets/data/dry-food.json').then(res => res.json()).then(json => {
      this.dryFoodsData = json;
      this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
        this.pet = pet;
        this.petDryFoods = pet.dryFoods;
        this.petDryFoods.forEach(val => {
          this.syncData(val);
        })
      })
    });
  }

  filterList(evt) {
    const trimmedFood = evt.target.value.slice(0,55)
    this.foodSearch.value = trimmedFood
    this.dryFood = trimmedFood;
    const searchTerm = trimmedFood;
    this.dryFoodsList = this.dryFoodsData;

    if (searchTerm && searchTerm.trim() !== '') {
      this.dryFoodsList = this.dryFoodsList.filter((item) => {
        return (item.toLowerCase().includes(searchTerm.toLowerCase()));
      });
      this.isItemAvailable = true;
    } else {
      this.isItemAvailable = false;
    }
  }

  dryFoodCustom(item: string) {
    if (item.length === 0) return
    const titleCaseItem = item.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    this.dryFoodClicked(titleCaseItem)
  }

  dryFoodClicked(item: string) {
    if (item.length === 0) return
    if(this.petDryFoods.length){
      if (this.petDryFoods.some( ({val}) => val == item)) return false;
    }
    this.petDryFoods.push(item);
    this.searchBar = '';
    this.isItemAvailable = false;

    this.syncData(item);

    this.checkDryFoods();
  }

  syncData(item){
    const index = this.dryFoodsData.indexOf(item, 0);
    if (index > -1) {
      this.dryFoodsData.splice(index, 1);
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
    const index = this.petDryFoods.indexOf(item);
    this.petDryFoods.splice(index, 1);
    this.checkDryFoods();
    this.dryFoodsData.push(item);
  }

  checkDryFoods() {
    if (this.petDryFoods.length > 0) {
      this.hasDryFoods.emit({
        key: 'dryFoods',
        val: this.petDryFoods
       } );
    } else {
      this.hasDryFoods.emit({
        key: 'dryFoods',
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
