import { Component, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { NavController, PopoverController } from '@ionic/angular';
import { PetSwitcherComponent } from './pet-switcher/pet-switcher.component';
import { Pet } from '../../../classes/pet';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service';
import { AccountMenuComponent } from './account-menu/account-menu.component';

@Component({
  selector: 'app-homepage-header',
  templateUrl: './homepage-header.component.html',
  styleUrls: ['./homepage-header.component.scss'],
})

export class HomepageHeaderComponent {
  @Input() page: string;
  @Input() type: string;
  @Input() hasBackButton: boolean;
  petPhoto: string;
  pet: Pet;
  pets: Pet[];
  currentPet: any;
  petSwitcher: any;
  accountMenu: any;
  public petImage = "../../../assets/default_dog_profile.png";

  constructor(
    private dataService: DataService, 
    private navController: NavController, 
    private popoverController: PopoverController,
    private infoErrorModal: InfoErrorModalService
  ) {
    this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
      this.pet = pet;
      this.petImage = pet.picture ? `${pet.picture}?${+new Date()}` : "../../../assets/default_dog_profile.png";
      this.currentPet = this.pet;
    });
    this.pets = this.dataService.pets;
  }

  addPet() {
    this.navController.navigateRoot(['details'], {queryParams: {multiPet: '1'}});
  }

  async openPetSwitcher(ev) {
    this.pets = await this.dataService.pets; // wait for updated pets
    this.petSwitcher = await this.popoverController.create({
      component: PetSwitcherComponent,
      componentProps: {
        pets: this.pets,
        currentPetName: this.pet.name
      },
      cssClass: 'pet-switcher',
      event: ev,
      mode: 'md'
    });
    await this.petSwitcher.present();
  }

  async openAccountMenu(ev) {
  }

  goBack() {
    this.navController.pop();
  }
}
