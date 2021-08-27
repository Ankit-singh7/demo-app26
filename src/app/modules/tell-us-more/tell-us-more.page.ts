import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Platform, AnimationController, NavController } from "@ionic/angular";
import { element } from 'protractor';
import { Pet } from '../../classes/pet';
import { TrackingService } from '../../services/tracking.service';
import { environment } from 'src/environments/environment';
import {DeviceInfoService} from '../../services/device-info.service';
import { Device } from '@ionic-enterprise/device/ngx';
import { StatusBar } from "@capacitor/status-bar";
import { Keyboard } from "@capacitor/keyboard";


@Component({
  selector: "app-tell-us-more",
  templateUrl: "./tell-us-more.page.html",
  styleUrls: ["./tell-us-more.page.scss"],
})
export class TellUsMoreComponent implements OnInit {
  public totalQuestions = 0;
  public currentQuestion = 1;
  public petName;
  public activeQuestions;
  public submittedQuestions;
  public activeIndex;
  public activeQuestion;
  public weightSelect: string;
  public isKeyboardOpen = false;
  public weightEntered: boolean = false;
  public noWeight: boolean = false;
  public invalidWeight = false;
  public hasDryFoods = false;
  public currentDryFoods: object;
  public hasWetFoods = false;
  public currentWetFoods: object;
  public hasAllergies = false;
  public currentAllergies: object;
  public hasConditions = false;
  public currentConditions: object;
  public answeredMealType = false;
  public pet;
  public allowScroll;
  public hasPet = false;
  private stopPresses = false;
  public useiOS12Styling: boolean;
  public weight: number;

  customPopoverOptions: any = {
    cssClass: "weight-popover",
    mode: "md"
  };
  constructor(
    private dataService: DataService,
    private platform: Platform,
    private animationController: AnimationController,
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    private trackingService: TrackingService,
    private deviceInfo: DeviceInfoService
  ) {
    this.weightSelect = "kg";
    // if (this.platform.is("ios")) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Light,
    //   });
    // }
    if (Keyboard) {
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardOpen = false;
        this.onKeyboardStateChange(false);
        this.cdr.detectChanges();
      });
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardOpen = true;
        this.cdr.detectChanges();
      });

    }
    this.dataService.currentPet$.subscribe(pet => { // subscribe for when current pet changes
      this.pet = pet;
    })

    this.useiOS12Styling = deviceInfo.isOutdatedIOS;
  }

  ngOnInit() {
    this.dataService.currentPet$.subscribe((pet : Pet) => {
      if (pet) {
        this.petName = pet.name;
        //gets all questions and only shows uncompleted ones
        if(!this.hasPet) {
          const hasCompletedMealTypeQuestions = this.pet.questions.some(question => {
            return question.question === 'mealTypePerMeal' && question.completed
          });
  
          if (!hasCompletedMealTypeQuestions) {
            this.activeQuestions = this.pet.questions.filter(question => {
              return !question.completed && !question.mealTypeQuestion
            })
          } else {
            this.activeQuestions = this.pet.questions.filter(question => {
              return !question.completed && (!question.completed && !question.mealTypeQuestion && !question.chosenMealType) || (!question.completed && question.mealTypeQuestion && question.chosenMealType)
            });
          }
          if (this.activeQuestions === undefined || this.activeQuestions.length === 0) {
            this.backToTracker(true)
          }
          this.hasPet = true;
        }
      }
    });
    this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `tell us more - question ${this.currentQuestion}` });

    this.totalQuestions = this.activeQuestions.length;
    this.setActiveQuestion();
    
  }

  setActiveQuestion() {
    this.activeIndex = this.currentQuestion - 1;
    this.activeQuestion = this.activeQuestions[this.currentQuestion - 1];
    this.stopPresses = false;
    this.cdr.detectChanges();
  }

  async submitData(e) {
    if (this.stopPresses) return;
    this.stopPresses = true;
    await this.dataService.updatePetData(e.key, e.val);
    this.trackingService.trackPetUpdate(e);
    
    this.updateSubmittedQuestions();
    this.nextQuestion();
  }

  async updateSubmittedQuestions() {
    this.submittedQuestions = this.pet.questions.map(question => {
      return {
        question: question.question,
        completed: question.completed || question.question === this.activeQuestion.question,
        mealTypeQuestion: question.mealTypeQuestion,
        chosenMealType: question.chosenMealType
      };
    });
    await this.dataService.updatePetData('questions', this.submittedQuestions);

  }

  private backToTracker(navigateRoot = false) {
      const answeredAllQuestions = this.pet.questions.every(question => {
        return question.completed && this.pet.questions.some(question => {
          return question.completed && question.chosenMealType;
        });
      });
      this.dataService.updatePetData('petProfileComplete', answeredAllQuestions);
      this.dataService.updatePetData('tellUsMoreComplete', answeredAllQuestions);
      
      setTimeout(() => {
        if (navigateRoot) this.navController.navigateRoot(["homepage-tabs/tracker"]);
        else this.navController.navigateBack('homepage-tabs/tracker');
      }, 500);

      this.changeStatusBarColour();
  }
  
  goBack() {
    if (this.currentQuestion === 1) {
      this.backToTracker()
    } else {
      this.currentQuestion--;
      this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `tell us more - question ${this.currentQuestion}` });
      this.setActiveQuestion();
    }
  }

  nextQuestion() {
    let animDelay = environment.ctaAnimationDelay;
    if (this.activeQuestion.question === 'desexed' || this.activeQuestion.question === 'mealTypePerMeal'){
      animDelay += environment.cardTransitionDelay;
    }
    setTimeout(() => {
      if (this.currentQuestion === this.totalQuestions) {
        this.stopPresses = false;
        this.backToTracker(true)
      } else {
        this.currentQuestion++;
        this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: `tell us more - question ${this.currentQuestion}` });
        this.setActiveQuestion();
      }
    }, animDelay);
  }

  async submitWeight(weight, weightType) {
    if (this.stopPresses) return;
    this.stopPresses = true;
    await this.dataService.updatePetData('weight', weight);
    await this.dataService.updatePetData('weightType', weightType);
    this.trackingService.trackPetUpdate({ key: "weight", val: weight });
    this.updateSubmittedQuestions();
    this.nextQuestion();
  }
  
  hasEnteredWeight(e) {
    this.weightEntered = e.detail.value.trim().length === 0 ? false : true;
    const weightNum = parseFloat(e.detail.value.trim());
    this.noWeight = weightNum <= 0 ? true : false;
    this.invalidWeight = Number.isNaN(weightNum) ? true : false;
  }

  weightSelected(e) {
    this.weightSelect = e.detail.value;
  }

  async showMealLookupScreens(e) {
    if (this.stopPresses) return;
    this.stopPresses = true;
    const newQuestions = this.pet.questions.filter(question => {
      return question.chosenMealType && !question.completed
    });
    const removeExistingMealTypeQuestions = this.activeQuestions.filter(question => {
      return !question.mealTypeQuestion;
    });
    this.activeQuestions = removeExistingMealTypeQuestions;
    await this.activeQuestions.splice(this.currentQuestion, 0, ...newQuestions);
    await this.dataService.updatePetData(e.key, e.val);
    this.totalQuestions = this.activeQuestions.length;
    this.updateSubmittedQuestions();
    this.nextQuestion();
  }


  checkDryFoods(event) {
    this.hasDryFoods = event.val.length > 0;
    if (this.hasDryFoods) {
      this.currentDryFoods = event
    }
  }

  checkWetFoods(event) {
    this.hasWetFoods = event.val.length > 0;
    if (this.hasWetFoods) {
      this.currentWetFoods = event
    }
  }

  checkAllergies(event) {
    this.hasAllergies = event.val === null || event.val.length > 0;
    if (this.hasAllergies) {
      this.currentAllergies = event
    }
  }

  checkConditions(event) {
    this.hasConditions = event.val === null || event.val.length > 0;
    if (this.hasConditions) {
      this.currentConditions = event
    }
  }

  resizeScreen(event) {
    this.allowScroll = event;
    this.cdr.detectChanges();
  };

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

  changeStatusBarColour() {
    // if (this.platform.is("ios")) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Dark,
    //   });
    // }
  }
}
