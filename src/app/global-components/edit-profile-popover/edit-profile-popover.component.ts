import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-profile-popover',
  templateUrl: './edit-profile-popover.component.html',
  styleUrls: ['./edit-profile-popover.component.scss'],
})
export class EditProfilePopoverComponent implements OnInit {
  public pet;
  public mealsCompleted = false;
  private mealData;
  @Input() index: string;
  @Input() unMatchingData: boolean;
  constructor(private dataService: DataService, private popoverController: PopoverController, private trackingService: TrackingService) {
    this.dataService.currentPet$.subscribe(pet => { // subscribe for when current pet changes
      this.pet = pet;
    });
  }

  ngOnInit() {
  }

  close() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, environment.ctaAnimationDelay / 1.5); // /1.5 to account for fade out of modal
  }

  checkMeals(e){
    if(e.val.length == this.pet.mealFrequency){
      this.mealsCompleted = true;
      this.mealData = e;
    }
  }

  submitMealData(){
    if (!this.mealsCompleted) return
    this.submitData(this.mealData).then( () => this.close());
  }

  async submitData(e) {
    await this.dataService.updatePetData(e.key, e.val).then(async () => {
      if(
        e.key !== 'mealTypePerMeal'
        && e.key !== 'dryFoods'
        && e.key !== 'wetFoods'
        && e.key !== 'allergies'
        && e.key !== 'conditions'
      ) { this.close() }
      this.pet.questions.forEach(question => {
        if (question.question === e.key || (question.question === 'desexed' && (e.key === 'neutered' || e.key === 'spayed' || e.key === 'desexedUndecided')) ) {
          question.completed = true;
        }
      });
      await this.dataService.updatePetData('questions', this.pet.questions);
      this.trackingService.trackPetUpdate(e);
    });
  }
}
