import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor() { }

  getPetAgeString(age) {
    let ageString = '';
    switch (age) {
      case '0-0.5': {
        ageString = '6 months or younger';
        break;
      }
      case '0.5-1': {
        ageString = '6 to 12 months';
        break;
      }
      case '1-2': {
        ageString = '1 to 2 years';
        break;
      }
      case '3-5': {
        ageString = '3 to 5 years';
        break;
      }
      case '6-9': {
        ageString = '6 to 9 years';
        break;
      }
      case '10+': {
        ageString = '10+ years';
        break;
      }
      default: {
        ageString = '-';
        break;
      }
    }
    return ageString;
  }

  getPreferredWeight(){

  }
}
