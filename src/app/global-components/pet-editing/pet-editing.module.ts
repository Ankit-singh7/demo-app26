import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AgeComponent } from "./age/age.component";
import { AllergiesEditComponent } from "./allergies-edit/allergies-edit.component";
import { ConditionsEditComponent } from "./conditions-edit/conditions-edit.component";
import { DeSexingComponent } from "./de-sexing/de-sexing.component";
import { DryFoodEditComponent } from "./dry-food-edit/dry-food-edit.component";
import { HumanFoodsComponent } from "./human-foods/human-foods.component";
import { MealTypesComponent } from "./meal-types/meal-types.component";
import { MealsPerDayComponent } from "./meals-per-day/meals-per-day.component";
import { TreatsComponent } from "./treats/treats.component";
import { WetFoodEditComponent } from "./wet-food-edit/wet-food-edit.component";
import { CtaModule } from "../cta/cta.module";

@NgModule({
  declarations: [
    AgeComponent,
    AllergiesEditComponent,
    ConditionsEditComponent,
    DeSexingComponent,
    DryFoodEditComponent,
    HumanFoodsComponent,
    MealTypesComponent,
    MealsPerDayComponent,
    TreatsComponent,
    WetFoodEditComponent,
  ],
  imports: [IonicModule, FormsModule, CommonModule, CtaModule],
  exports: [
    AgeComponent,
    AllergiesEditComponent,
    ConditionsEditComponent,
    DeSexingComponent,
    DryFoodEditComponent,
    HumanFoodsComponent,
    MealTypesComponent,
    MealsPerDayComponent,
    TreatsComponent,
    WetFoodEditComponent,
  ],
})
export class PetEditingModule {}
