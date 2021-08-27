import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AnimationController, Platform, PopoverController } from '@ionic/angular';

import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Pet } from '../../classes/pet';


import {StatusBar} from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';

import BAD_WORDS from '../../../assets/data/bad-words.json';
import PET_BREEDS from '../../../assets/data/petBreeds.json';
import { WarningPopoverComponent } from 'src/app/global-components/warning-popover/warning-popover.component';
import { TrackingService } from '../../services/tracking.service';
import { environment } from 'src/environments/environment';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service';


@Component({
  selector: 'app-details',
  templateUrl: 'details.page.html',
  styleUrls: ['details.page.scss']
})
export class Details implements OnInit {
  totalQuestions = 8;
  currentQuestion = 1;
  isItemAvailable = false;

  private petBreedsData: any[];
  public petBreeds: any[];
  public badWords: any[];
  public nameEntered: boolean;
  public breedEntered: boolean;
  public hasBadWord: boolean;
  public hasDuplicateName: boolean = false;
  public nameTooLong: boolean = false;
  public pet: Pet;
  public petNames = [];
  public petName = '';
  public petBreed = '';
  private multiPetData = [];
  public multiPetMode = false;
  private quitAddingDogPopover;
  private isKeyboardOpen = false;
  private stopPresses = false;

  public hasBadWordErrorText = "That’s not very nice! Please try a different name"
  public hasDuplicateNameErrorText = "You’ve already added this dog name! Please choose another"
  public nameTooLongErrorText = "Character limit reached. Please try a shorter name."

  @ViewChild('breedSearch', { static: false }) breedSearch: any;

  constructor(
    private navController: NavController,
    private animationController: AnimationController,
    private popoverController: PopoverController,
    private platform: Platform,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private trackingService: TrackingService,
    private infoErrorModal: InfoErrorModalService
  ) {
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Light
    //   });
    // }
    if (Keyboard) {
      Keyboard.addListener('keyboardWillHide', () => {
        this.onKeyboardStateChange(false);
      });
    }
    this.dataService.onboardingInProgress("details");
  }

  navigate(path) {
    this.navController.navigateRoot([path]);
  }

  ionViewDidEnter() {
    SplashScreen.hide()
  }

  ngOnInit() {
    this.petBreedsData = PET_BREEDS;
    this.badWords = BAD_WORDS;
    let multiPet = '1'
    this.activatedRoute.data.subscribe(data => {
      // if (String(data.routeData.multiPet) === '1') { // multi pet mode      
      if (multiPet === '1') { // multi pet mode

        this.multiPetMode = true;
        this.multiPetData = [];
        this.currentQuestion = 1;
        // important to not set local data to 1, discard this flow if pet isn't complete
        this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `details - question ${this.currentQuestion}` });
      } else {
        this.multiPetMode = false;
        const cq = data.routeData.currentQuestion;
        if (cq === this.totalQuestions + 1) { // we're passed the final question
          return this.navigate('homepage-tabs/tracker');
        } else {
          this.currentQuestion = !cq ? 1 : cq; // error catch, Q1 if we didnt' get a response
          this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `details - question ${this.currentQuestion}` });
        }
      }
    });

    this.dataService.currentPet$.subscribe((pet: Pet) => {
      if (pet && !this.multiPetMode) {
        if (pet.name) {
          this.petName = pet.name;
          this.hasEnteredName(this.petName);
        }
        if (pet.breed) {
          this.petBreed = pet.breed;
          this.hasEnteredBreed(this.petBreed, this.petBreed);
        }
        this.pet = pet;
      }
      if(this.multiPetMode) {
        this.petNames = this.dataService.pets.map((pet) => {
          return pet.name.toLowerCase();
         })
      }
    })

  }

  async nextQuestion() {
    if (!this.multiPetMode) {
      // if multi pet mode, ignore this, we discard question progress with multi pets
      await this.dataService.setCurrentOnboardingQuestion(this.currentQuestion + 1); // + 1 we want to land on the next Q
    }
    if (this.currentQuestion === this.totalQuestions) {
      if (this.multiPetMode) {
        let newPet = new Pet;
        newPet.weightType = 'kg';
        // if in multi pet mode, loop the pets data in memory and submit the data (updatePetData takes single key/value each loop)
        this.multiPetData.forEach(async (petItem, index) => {
          newPet[petItem.key] = petItem.value;

          //await this.dataService.updatePetData(petItem.key, petItem.value)
          // if weve done the last item, the new pet is saved so we can go to the tracker
          if (index + 1 === this.multiPetData.length) {
            await this.dataService.addPet(newPet);
            this.stopPresses = false;
            this.completeGoToTracker()
          }
        });
      } else {
        await this.dataService.completedInitialSetup();
        await this.dataService.addPet(this.pet);
        await this.dataService.updatePetData('onboardingComplete', true);
        this.stopPresses = false;
        this.completeGoToTracker()
      }
    }
      // this question progression is local to the view
    // if we quit while on a multi pet, this is reset to question 1
    else {
      setTimeout(() => {
        this.currentQuestion++;
        this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `details - question ${this.currentQuestion}` });
        this.stopPresses = false;
      }, (environment.ctaAnimationDelay + environment.cardTransitionDelay));
    }
  }

  goBack() {
    this.dataService.setCurrentOnboardingQuestion(this.currentQuestion) // if we exit, we land on the question after the one we're going back to
      .then(() => {
        if (this.currentQuestion === 1) {
          this.navController.navigateBack('intro/guide');
          this.hasEnteredName(this.petName);
        } else if (this.currentQuestion === 2) {
          this.hasEnteredBreed(this.petBreed, this.petBreed);
        }
        this.currentQuestion--;
        this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `details - question ${this.currentQuestion}` });
      })
      .catch(err => this.infoErrorModal.displayModal("error", err));
  }

  submitData(key, value) {
    if (this.stopPresses) return
    this.stopPresses = true
    // if multi pet mode, hold data in memory and dont commit to storage
    // if not multi pet mode,
    if (this.multiPetMode) this.multiPetData.push({key, value});
    else this.dataService.updatePetData(key, value);
    this.nextQuestion();
  }

  closeKeyboard(event) {
    if (event.key === 'Enter') {
      if (Keyboard) {
        Keyboard.hide();
      }
    }
  }

  closeSearch(evt) {
    this.hasEnteredBreed(this.petBreed, this.petBreed);
  }

  filterList(evt) {
    this.hasEnteredBreed(evt, this.petBreed);
    this.petBreed = evt.target.value;;
    const searchTerm = evt.target.value;;
    this.breedSearch.value = evt.target.value;;
    this.petBreeds = this.petBreedsData;
    if (!this.isKeyboardOpen) {
      this.isItemAvailable = false;
    }
    else if (searchTerm && searchTerm.trim() !== '') {
      this.petBreeds = this.petBreeds.filter((item) => {
        return (item.toLowerCase().includes(searchTerm.toLowerCase()));
      });
      this.isItemAvailable = true;
     } else {
      this.isItemAvailable = false;
    }
  }

  breedClicked(item) {
    this.petBreed = item;
    this.isItemAvailable = false;
    this.petBreeds = this.petBreeds.filter((item) => {
      return '';
    });
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

  hasEnteredName(e) {
    const val = e.detail ? e.detail.value : e;
    this.nameEntered = (val.trim().length === 0 || !this.isLetter(val)) ? false : true;
    this.hasBadWord = this.badWords.some(badWord => val.split(" ").some(nameWord => nameWord.toLowerCase() === badWord));
    this.nameTooLong = val.trim().length > 20
    this.petName = val.trim();
    if (this.multiPetMode) {
      this.hasDuplicateName = this.multiPetMode && this.petNames.includes(val.toLowerCase()) ? true : false;
    }
    // Mixpanel event name: Error
    if (this.hasBadWord) this.trackingService.trackMe("Error", { "Error Text": this.hasBadWordErrorText })
    else if (this.nameTooLong) this.trackingService.trackMe("Error", { "Error Text": this.nameTooLongErrorText })
    else if (this.hasDuplicateName) this.trackingService.trackMe("Error", { "Error Text": this.hasDuplicateNameErrorText })
  }

  isLetter(c) {
    return c.toLowerCase() !== c.toUpperCase();
  }

  hasEnteredBreed(e, breed = null) {
    const val = e.detail ? e.detail.value : e;
    this.breedEntered = val !== "";
  }

  async quitAddNewDog() {
    this.quitAddingDogPopover = await this.popoverController.create({
      component: WarningPopoverComponent,
      componentProps: {
        icon: 'error',
        text: "Are you sure you want to quit adding a new dog? Progress will not be saved.",
        cancelText: "Cancel",
        confirmText: "Quit",
        callback: this.navigate.bind(this, "homepage-tabs/tracker")
      },
      cssClass: 'warning-popover',
      mode: 'md'
    });
    await this.quitAddingDogPopover.present();
  }

  private completeGoToTracker() {
    this.dataService.onboardingInProgress(null);
    const pet: Pet = this.dataService.currentPetAsSingleValue
    this.trackingService.trackMe("Pet Registered", {
      "Name": pet.name,
      "Breed": pet.breed,
      "Age Bracket": pet.age,
      "Meals": Number(pet.mealFrequency),
      "Treats": pet.treats,
      "Human Food": pet.humanTreats,
      "Aim": pet.goals,
    })
    setTimeout(() => {
      this.navigate('homepage-tabs/tracker');
    }, (environment.ctaAnimationDelay + environment.cardTransitionDelay));
  }
}
