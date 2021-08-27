import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class DetailsResolver implements Resolve<any> {
  constructor(private dataService: DataService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.dataService.getCurrentOnboardingQuestion()
    .then(currentQuestion => { return { currentQuestion, multiPet: route.queryParams["multiPet"] } })
    .catch((err) => { return { currentQuestion: 1, multiPet: route.queryParams["multiPet"] } })
  }
}
