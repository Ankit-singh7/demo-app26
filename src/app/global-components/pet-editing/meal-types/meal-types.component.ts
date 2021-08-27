import { Component, Input, EventEmitter, Output, ChangeDetectorRef, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Pet } from 'src/app/classes/pet';
import { emit } from 'process';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-edit-meal-types',
  templateUrl: './meal-types.component.html',
  styleUrls: ['./meal-types.component.scss'],
})
export class MealTypesComponent implements OnInit{
  @Input() type: string;
  @Input() unMatchingData: boolean;
  @Output() submitOnboardingData = new EventEmitter();
  @Output() submitData = new EventEmitter();

  public totalMeals;
  public totalMealsArray;
  public mealsCount = 0;
  public pet;
  public stopPresses = false

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef, private trackingService: TrackingService) {

    this.dataService.currentPet$.subscribe((pet: Pet) => {
      this.pet = pet;
      this.totalMeals = pet.mealFrequency;
    });
    this.totalMealsArray = Array(parseInt(this.totalMeals))
      .fill(null)
      .map(() => {
        return {type: '', used: false, active: false};
      });
  }

  ngOnInit(): void {
    this.updateButtons();
  }
  updateButtons() {
    if(this.pet.mealTypePerMeal.length > 0 && !this.unMatchingData){
      this.pet.mealTypePerMeal.forEach((meal, i) => {
        if (!this.totalMealsArray[i]) return
        this.totalMealsArray[i].active = true;
        switch (meal.foodConsistency) {
          case('wet'): {
            this.totalMealsArray[i].type = 'wet';
            break;
          }
          case('dry'): {
            this.totalMealsArray[i].type = 'dry';
            break;
          }
          case('mixed'): {
            this.totalMealsArray[i].type = 'mixed';
            break;
          }
        }
      });
      this.mealsCount = this.totalMealsArray.filter(meal => meal.active).length
    }
  }
  async submitMeal(mealType, i) {
    if (this.stopPresses) return
    this.stopPresses = true
    this.totalMealsArray[i].type = mealType;
    if (!this.totalMealsArray[i].used) {
      if (!this.totalMealsArray[i].active) this.mealsCount++;
      this.totalMealsArray[i].used = true;
      this.totalMealsArray[i].active = true;
    }
    if (this.mealsCount === this.totalMealsArray.length) {
      const mealData = this.totalMealsArray.map((meal, i) => {
        return {
          mealNumber: i + 1,
          foodConsistency: meal.type
        };
      });

      await this.submitMealTypes();
      await this.dataService.updatePetData('questions', this.pet.questions);
      this.submitData.emit({
        key: 'mealTypePerMeal',
        val: mealData
      });

      //let onboarding screen know you have submitted your meal types
      if (this.type === 'onboarding') {
        this.submitOnboardingData.emit(
          {
            key: 'mealTypePerMeal',
            val: mealData
          }
        );
        // only track this on TLM/onboarding - pet profile tracks on it's own
        this.trackingService.trackPetUpdate({ key: "mealTypePerMeal", val: mealData })
      }
    }
    this.cdr.detectChanges();
    setTimeout(() => {
      this.stopPresses = false
    }, 200);
  }

  async submitMealTypes() {
    const mealTypes = [];
    const onlyDry = this.totalMealsArray.every(meals => {
      return meals.type === 'dry';
    });
    const onlyWet = this.totalMealsArray.every(meals => {
      return meals.type === 'wet';
    });

    const mixed = this.totalMealsArray.some(meals => {
      return (meals.type === 'mixed');
    });

    this.totalMealsArray.forEach(meal => {
      if (meal.type === 'dry' || meal.type === 'wet') {
        mealTypes.push(meal.type);
      }
    });

    const dryAndWet = mealTypes.includes('dry') && mealTypes.includes('wet');

    this.pet.questions.forEach(question => {
      if(this.type === 'onboarding') {
        if (question.question === 'dryFoods' || question.question === 'wetFoods') {
          question.completed = false;
        }
      }
      if (onlyDry) {
        if (question.question === 'dryFoods') {
          question.chosenMealType = true;
        } else {
          question.chosenMealType = false;
        }
        if (question.question === 'wetFoods') {
          question.completed = true;
        }
      } else if (onlyWet) {
        if (question.question === 'wetFoods') {
          question.chosenMealType = true;

        } else {
          question.chosenMealType = false;
        }
        if (question.question === 'dryFoods') {
          question.completed = true;
        }
      } else if (mixed || dryAndWet) {
        if (question.question === 'dryFoods' || question.question === 'wetFoods') {
          question.chosenMealType = true;
        } else {
          question.chosenMealType = false;
        }
      }
    });
  }
}
