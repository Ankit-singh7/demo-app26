import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { WeightPopoverComponent } from '../../../global-components/weight-popover/weight-popover.component';
import { IonContent, NavController, PopoverController } from '@ionic/angular';
import { PetService } from '../../../services/pet.service';
import { TrackingService } from '../../../services/tracking.service';
import { EditProfilePopoverComponent } from 'src/app/global-components/edit-profile-popover/edit-profile-popover.component';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service';
import {Keyboard} from '@capacitor/keyboard'


@Component({
  selector: 'app-pets',
  templateUrl: 'pets.page.html',
  styleUrls: ['pets.page.scss']
})
export class PetsPage {

  public activeDetail = 'food';
  public pet;
  public showEditBox = false;
  public showEdit = 0;
  public editPopover;
  weightPicker: any;
  public noWeight = false;
  public invalidWeight = false;
  public unMatchingMealTypesMealFrequency = false;
  public unMatchingMealTypesCurrentFoods = false;
  public neededFood = '';
  IMAGE_PATH = '';

  public petImage;
  @ViewChild('petsContent') content: IonContent;

  constructor(
    private dataService: DataService,
    private popoverController: PopoverController,
    public petService: PetService,
    private trackingService: TrackingService,
    private cdr: ChangeDetectorRef,
    private infoErrorModalService: InfoErrorModalService,
    private navController: NavController,
  ) {
    this.dataService.currentPet$.subscribe(pet => { // subscribe for when current pet changes
      this.pet = pet;
      if (this.pet.picture) {
        this.petImage = `${this.pet.picture}?${+new Date()}`;
      } else {
        this.petImage = '../../../../assets/pet-details/howmuchisthatdoggyinyellow.png';
      }
      this.checkValidation();
    });
  }
  checkValidation() {
    this.unMatchingMealTypesMealFrequency = this.pet.mealFrequency != this.pet.mealTypePerMeal.length && this.pet.mealTypePerMeal.length > 0 ? true : false;
    this.unMatchingMealTypesCurrentFoods = this.checkMealTypesMatchingChosenFoods() ? true : false;
  }
  checkMealTypesMatchingChosenFoods() {
    if (this.pet && this.pet.mealTypePerMeal.length !== 0) {

      const chosenFoods = this.pet.mealTypePerMeal.flatMap(meal => meal.foodConsistency);

      if (chosenFoods.every(food => food === 'dry') && this.pet.wetFoods.length > 0) {
        this.neededFood = 'wet';
        return true;
      }
      if (chosenFoods.every(food => food === 'wet') && this.pet.dryFoods.length > 0) {
        this.neededFood = 'dry';
        return true;
      }
    }
    return false;
  }
  ionViewDidEnter() {
    this.content.scrollToTop();
    this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `pets - ${this.activeDetail} tab` });
  }

  toggleDetail(elem) {
    if (elem === 'health' && this.activeDetail === 'food') {
      this.activeDetail = 'health';
      this.cdr.detectChanges();
      this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `pets - ${this.activeDetail} tab` });
    } else if (elem === 'food' && this.activeDetail === 'health') {
      this.activeDetail = 'food';
      this.cdr.detectChanges();
      this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `pets - ${this.activeDetail} tab` });
    }
  }

  async toggleEdit(index?, unMatchingData?) {
    if (index) {
      this.showEdit = index;
      this.editPopover = await this.popoverController.create({
        component: EditProfilePopoverComponent,
        componentProps: {
          index: this.showEdit,
          unMatchingData: unMatchingData
        },
        cssClass: 'edit-profile-popover',
        mode: 'md',
      });
      await this.editPopover.present();
    }


  }

  async openWeightPicker(ev) {
    this.weightPicker = await this.popoverController.create({
      component: WeightPopoverComponent,
      cssClass: 'weight-switcher',
      event: ev,
      mode: 'md'
    });
    await this.weightPicker.present();
  }

  async submitData(e) {
    await this.dataService.updatePetData(e.key, e.val).then(async () => {
      if (e.key !== 'mealTypePerMeal' && e.key !== 'dryFoods' && e.key !== 'wetFoods' && e.key !== 'allergies' && e.key !== 'conditions') {
        this.toggleEdit();
      }
      this.pet.questions.forEach(question => {
        if (question.question === e.key || (question.question === 'desexed' && (e.key === 'neutered' || e.key === 'spayed'))) {
          question.completed = true;
        }
      });
      await this.dataService.updatePetData('questions', this.pet.questions);
      this.trackingService.trackPetUpdate(e);
    });
  }

  setWeight(weight) {
    if (parseFloat(weight) <= 0 || Number.isNaN(parseFloat(weight))) {
      if (parseFloat(weight) <= 0) {
        this.noWeight = true;
        this.invalidWeight = false;
      }
      if (Number.isNaN(parseFloat(weight)) && weight.length > 0) {
        this.invalidWeight = true;
        this.noWeight = false;
      }
      this.pet.weight = '';

    } else {
      this.invalidWeight = false;
      this.noWeight = false;
      this.submitData({key: 'weight', val: weight});
    }
    
  }

  async updatePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        direction: CameraDirection.Rear
      });
      this.dataService.updatePetData('picture', image.webPath).then(() => {
        this.trackingService.trackMe("Pet Photo Added")
      });
    } catch (err) {
      // user cancelled the camera or denied permissions to access camera
      if (!err) return this.cameraFail() // unknown native error
      if (err.message !== "User cancelled photos app") return this.cameraFail(`${err.message}.`);
      else if (err.message.toLowerCase().indexOf("edit") !== -1) return this.cameraFail(`You don’t have any apps to edit photos with, so we couldn’t do that.`);
      else return console.log("User cancelled photos app.")
    }
  }

  async cameraFail(message = "Something went wrong, but like a lost tennis ball we can’t seem to spot it! Please try again.") {
    this.infoErrorModalService.displayModal("error", message)
  }

  closeKeyboard(event) {
    if (event.key === 'Enter') {
      if (Keyboard) {
        Keyboard.hide();
      }
    }
  }
}
